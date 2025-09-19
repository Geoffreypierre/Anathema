import React, { useState, useEffect } from 'react';
import { useAppStore } from '../state/store';
import copyIcon from '/img/copy.png';
import dropIcon from '/img/drop.png';

const injectScrollbarStyles = () => {
    if (!document.head.querySelector('style[data-scrollbar]')) {
        const style = document.createElement('style');
        style.setAttribute('data-scrollbar', 'true');
        style.textContent = `
            .custom-scrollbar {
                scrollbar-width: thin;
                scrollbar-color: #666 #272822;
            }
            
            .custom-scrollbar::-webkit-scrollbar {
                width: 8px;
                height: 8px;
            }
            
            .custom-scrollbar::-webkit-scrollbar-track {
                background: #272822;
                border: none;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb {
                background: #666;
                border-radius: 4px;
                border: none;
            }
            
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                background: #888;
            }
            
            .custom-scrollbar::-webkit-scrollbar-corner {
                background: #272822;
            }
        `;
        document.head.appendChild(style);
    }
};

const getMethodColor = (method) => {
    switch (method?.toUpperCase()) {
        case 'GET':
            return '#65C754';
        case 'POST':
            return '#C7C754';
        case 'PATCH':
            return '#C79154';
        case 'PUT':
            return '#3498db';
        case 'DELETE':
            return '#C75454';
    }
};


const History = () => {
    const { history, clearHistory, clearSingleHistory } = useAppStore();
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        injectScrollbarStyles();
    }, []);

    const [flashMessage, setFlashMessage] = useState(null);

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleString();
    };

    const getStatusColor = (status) => {
        if (status >= 200 && status < 300) return '#27ae60';
        if (status >= 300 && status < 400) return '#f39c12';
        return '#e74c3c';
    };

    const isHTML = (str) => {
        return /<[a-z][\s\S]*>/i.test(str);
    };

    const highlightHTML = (html) => {
        let highlighted = html;

        const comments = [];
        highlighted = highlighted.replace(/(&lt;!--[\s\S]*?--&gt;)/g, (match, comment) => {
            const idx = comments.length;
            comments.push(comment);
            return `__COMMENT_${idx}__`;
        });

        highlighted = highlighted.replace(
            /(&lt;\/)([a-zA-Z][a-zA-Z0-9]*)(\s*)&gt;/g,
            `<span style="color:#F92672;">$1</span><span style="color:#F92672;">$2</span><span style="color:#F92672;">$3&gt;</span>`
        );

        highlighted = highlighted.replace(
            /(&lt;)([a-zA-Z][a-zA-Z0-9]*)([\s\S]*?)(\/?&gt;)/g,
            (match, openBracket, tagName, content, closeBracket) => {
                return `<span style="color:#F92672;">${openBracket}</span><span style="color:#F92672;">${tagName}</span>${content}<span style="color:#F92672;">${closeBracket}</span>`;
            }
        );

        highlighted = highlighted.replace(
            /([a-zA-Z_:][a-zA-Z0-9_\-:.]*)(=)(&quot;[^&]*?&quot;|&#x27;[^&]*?&#x27;)/g,
            `<span style="color:#A6E22E;">$1</span><span style="color:#F8F8F2;">$2</span><span style="color:#E6DB74;">$3</span>`
        );

        highlighted = highlighted.replace(
            /(&lt;style[^&]*?&gt;)([\s\S]*?)(&lt;\/style&gt;)/gi,
            (match, openTag, cssContent, closeTag) => {
                let cssHighlighted = cssContent
                    .replace(/(\/\*[\s\S]*?\*\/)/g, `<span style="color:#75715E;">$1</span>`)
                    .replace(/([^{}\/\*]+)(?=\s*\{)/g, `<span style="color:#A6E22E;">$1</span>`)
                    .replace(/([a-zA-Z-]+)(\s*:\s*)/g, `<span style="color:#66D9EF;">$1</span><span style="color:#F8F8F2;">$2</span>`)
                    .replace(/(:\s*)([^;{}]+)/g, `$1<span style="color:#E6DB74;">$2</span>`)
                    .replace(/([{};}])/g, `<span style="color:#F8F8F2;">$1</span>`);

                return `<span style="color:#F92672;">${openTag}</span>${cssHighlighted}<span style="color:#F92672;">${closeTag}</span>`;
            }
        );

        highlighted = highlighted.replace(
            /(&lt;script[^&]*?&gt;)([\s\S]*?)(&lt;\/script&gt;)/gi,
            (match, openTag, jsContent, closeTag) => {
                const jsComments = [];
                let jsHighlighted = jsContent
                    .replace(/(\/\*[\s\S]*?\*\/|\/\/.*$)/gm, (match, comment) => {
                        const idx = jsComments.length;
                        jsComments.push(comment);
                        return `__JS_COMMENT_${idx}__`;
                    });

                jsHighlighted = jsHighlighted
                    .replace(/\b(function|return|if|else|var|let|const|for|while|switch|case|break|continue|try|catch|finally|throw|new|this|class|extends|import|export|from|default|async|await|typeof|instanceof)\b/g,
                        `<span style="color:#F92672;">$1</span>`)
                    .replace(/\b(true|false|null|undefined|NaN|Infinity)\b/g, `<span style="color:#AE81FF;">$1</span>`)
                    .replace(/\b(\d+\.?\d*)\b/g, `<span style="color:#AE81FF;">$1</span>`)
                    .replace(/(['"`])((?:\\.|(?!\1)[^\\])*)\1/g, `<span style="color:#E6DB74;">$1$2$1</span>`)
                    .replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)(?=\s*\()/g, `<span style="color:#A6E22E;">$1</span>`)
                    .replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, `.<span style="color:#A6E22E;">$1</span>`)
                    .replace(/([+\-*/%=<>!&|^?:])/g, `<span style="color:#F92672;">$1</span>`)
                    .replace(/([()[\]{}])/g, `<span style="color:#F8F8F2;">$1</span>`);

                jsHighlighted = jsHighlighted.replace(/__JS_COMMENT_(\d+)__/g, (match, idx) =>
                    `<span style="color:#75715E;">${jsComments[idx]}</span>`);

                return `<span style="color:#F92672;">${openTag}</span>${jsHighlighted}<span style="color:#F92672;">${closeTag}</span>`;
            }
        );

        highlighted = highlighted.replace(/__COMMENT_(\d+)__/g, (match, idx) =>
            `<span style="color:#75715E;">${comments[idx]}</span>`);

        return highlighted;
    };

    const formatResponseData = (data) => {
        let formattedData;
        try {
            formattedData = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
        } catch {
            formattedData = String(data);
        }

        if (isHTML(formattedData)) {
            const escapedHTML = formattedData
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;');
            return highlightHTML(escapedHTML);
        }

        return formattedData;
    };

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
            {flashMessage && (
                <div style={{
                    position: 'fixed',
                    bottom: '40px',
                    right: '50%',
                    left: '50%',
                    width: 'max-content',
                    background: '#27ae60',
                    color: 'white',
                    padding: '10px 15px',
                    borderRadius: '5px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                    zIndex: 1,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {flashMessage}
                </div>
            )}
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0 }}>Request History</h1>
                <button
                    onClick={clearHistory}
                    disabled={history.length === 0}
                    style={{
                        padding: '8px 16px',
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: history.length === 0 ? 'not-allowed' : 'pointer',
                        opacity: history.length === 0 ? 0.5 : 1
                    }}
                >
                    Clear History
                </button>
            </div>

            {history.length === 0 ? (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999'
                }}>
                    No requests in history yet
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{
                        width: '50%',
                        borderRight: '1px solid #eee',
                        overflow: 'auto'
                    }}>
                        {history.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedRequest(item)}
                                style={{
                                    position: 'relative',
                                    padding: '15px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                    background: selectedRequest === item ? '#f8f9fa' : 'white',
                                    ':hover': { background: '#f5f5f5' }
                                }}
                            >
                                <img
                                    src={copyIcon}
                                    alt="Copy"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(item.url)
                                            .then(() => {
                                                setFlashMessage('URL copiée !');
                                                setTimeout(() => setFlashMessage(null), 2000);
                                            })
                                            .catch(() => {
                                                setFlashMessage('Erreur lors de la copie');
                                                setTimeout(() => setFlashMessage(null), 2000);
                                            });
                                    }}

                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '70px',
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer'
                                    }}
                                />
                                <img
                                    src={dropIcon}
                                    alt="delete"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        clearSingleHistory(item)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        bottom: '10px',
                                        right: '15px',
                                        width: '20px',
                                        height: '20px',
                                        cursor: 'pointer'
                                    }}
                                />

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '5px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

                                        <span style={{
                                            background: getMethodColor(item.method),
                                            color: 'white',
                                            padding: '2px 8px',
                                            borderRadius: '3px',
                                            fontSize: '12px',
                                            fontWeight: 'bold'
                                        }}>
                                            {item.method}
                                        </span>
                                        <span style={{
                                            color: getStatusColor(item.response?.status),
                                            fontWeight: 'bold'
                                        }}>
                                            {item.response?.status || 'Error'}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '12px', color: '#666' }}>
                                        {formatDate(item.timestamp)}
                                    </span>
                                </div>
                                <div style={{
                                    fontSize: '14px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {item.url}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ width: '50%', overflow: 'auto', padding: '20px' }}>
                        {selectedRequest ? (
                            <div>
                                <h3>Request Details</h3>

                                <div style={{ marginBottom: '20px' }}>
                                    <h4>Basic Info</h4>
                                    <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                        <div><strong>Method:</strong> {selectedRequest.method}</div>
                                        <div><strong>URL:</strong> {selectedRequest.url}</div>
                                        <div><strong>Time:</strong> {formatDate(selectedRequest.timestamp)}</div>
                                    </div>
                                </div>

                                {selectedRequest.headers && selectedRequest.headers.length > 0 && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4>Headers</h4>
                                        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                            {selectedRequest.headers.map((header, i) => (
                                                <div key={i} style={{ marginBottom: '5px' }}>
                                                    <strong>{header.key}:</strong> {header.value}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.body && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4>Request Body</h4>
                                        <pre className="custom-scrollbar" style={{
                                            background: '#272822',
                                            color: '#f8f8f2',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            overflow: 'auto',
                                            fontSize: '12px'
                                        }}>
                                            {selectedRequest.body}
                                        </pre>
                                    </div>
                                )}

                                {selectedRequest.response && (
                                    <div style={{ marginBottom: '20px' }}>
                                        <h4>Response</h4>
                                        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                            <div style={{ marginBottom: '10px' }}>
                                                <strong>Status:</strong>
                                                <span style={{
                                                    color: getStatusColor(selectedRequest.response.status),
                                                    marginLeft: '10px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {selectedRequest.response.status} {selectedRequest.response.statusText}
                                                </span>
                                            </div>
                                            <div><strong>Duration:</strong> {selectedRequest.response.duration}ms</div>
                                        </div>

                                        <pre
                                            className="custom-scrollbar"
                                            style={{
                                                background: '#272822',
                                                color: '#f8f8f2',
                                                padding: '15px',
                                                borderRadius: '4px',
                                                overflow: 'auto',
                                                fontSize: '12px',
                                                marginTop: '10px',
                                                maxHeight: '300px',
                                                whiteSpace: 'pre-wrap',
                                                position: ''
                                            }}
                                            dangerouslySetInnerHTML={{
                                                __html: formatResponseData(selectedRequest.response.data)
                                            }}
                                        >
                                        </pre>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#999'
                            }}>
                                Select a request to view details
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default History;