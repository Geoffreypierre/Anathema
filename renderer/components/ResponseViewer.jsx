import React, { useState, useRef, useEffect } from 'react';

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

const ResponseViewer = ({ response, loading, error }) => {
    const [activeTab, setActiveTab] = useState('body');
    const [height, setHeight] = useState(400);
    const [isDragging, setIsDragging] = useState(false);
    const resizeRef = useRef(null);
    const startY = useRef(0);
    const startHeight = useRef(0);

    useEffect(() => {
        injectScrollbarStyles();
    }, []);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isDragging) return;

            const deltaY = e.clientY - startY.current;
            const newHeight = Math.max(200, Math.min(800, startHeight.current + deltaY));
            setHeight(newHeight);
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            document.body.style.cursor = 'default';
            document.body.style.userSelect = 'auto';
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'ns-resize';
            document.body.style.userSelect = 'none';
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        startY.current = e.clientY;
        startHeight.current = height;
    };

    if (loading) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#666'
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                background: '#fee',
                color: '#c33',
                borderRadius: '4px',
                margin: '20px'
            }}>
                <h3>Error</h3>
                <p>{error.message}</p>
            </div>
        );
    }

    if (!response) {
        return (
            <div style={{
                padding: '40px',
                textAlign: 'center',
                color: '#999'
            }}>
                Send a request to see the response
            </div>
        );
    }

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

    const formatBody = () => {
        let formattedData;
        try {
            formattedData = JSON.stringify(JSON.parse(response.data), null, 2);
        } catch {
            formattedData = response.data;
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

    const getStatusColor = () => {
        if (response.status >= 200 && response.status < 300) return '#27ae60';
        if (response.status >= 300 && response.status < 400) return '#f39c12';
        return '#e74c3c';
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '20px',
                padding: '10px',
                background: '#f8f9fa',
                borderRadius: '4px'
            }}>
                <div>
                    <span style={{
                        color: getStatusColor(),
                        fontWeight: 'bold',
                        marginRight: '10px'
                    }}>
                        {response.status} {response.statusText}
                    </span>
                    <span style={{ color: '#666' }}>
                        {response.duration}ms
                    </span>
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    Size: {response.size || 'N/A'}
                </div>
            </div>

            <div style={{
                display: 'flex',
                borderBottom: '1px solid #ddd',
                marginBottom: '20px'
            }}>
                {['body', 'headers'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            border: 'none',
                            background: activeTab === tab ? '#3498db' : 'transparent',
                            color: activeTab === tab ? 'white' : '#666',
                            cursor: 'pointer',
                            textTransform: 'capitalize'
                        }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={{ position: 'relative' }}>
                {activeTab === 'body' && (
                    <>
                        <pre
                            className="custom-scrollbar"
                            style={{
                                background: '#272822',
                                padding: '15px',
                                borderRadius: '4px',
                                overflow: 'auto',
                                height: `${height}px`,
                                fontFamily: 'monospace',
                                fontSize: '12px',
                                whiteSpace: 'pre-wrap',
                                color: '#f8f8f2',
                                resize: 'none',
                                border: '1px solid #444'
                            }}
                            dangerouslySetInnerHTML={{ __html: formatBody() }}>
                        </pre>

                        { }
                        <div
                            ref={resizeRef}
                            onMouseDown={handleMouseDown}
                            style={{
                                position: 'absolute',
                                bottom: '-5px',
                                left: '0',
                                right: '0',
                                height: '10px',
                                cursor: 'ns-resize',
                                background: isDragging ? 'rgba(52, 152, 219, 0.3)' : 'transparent',
                                borderRadius: '0 0 4px 4px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <div style={{
                                width: '30px',
                                height: '4px',
                                background: '#666',
                                borderRadius: '2px',
                                opacity: isDragging ? 1 : 0.5
                            }}></div>
                        </div>
                    </>
                )}

                {activeTab === 'headers' && (
                    <div style={{
                        maxHeight: `${height}px`,
                        overflow: 'auto',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        background: '#fff'
                    }}>
                        {Object.entries(response.headers || {}).map(([key, value]) => (
                            <div
                                key={key}
                                style={{
                                    display: 'flex',
                                    padding: '8px 15px',
                                    borderBottom: '1px solid #eee'
                                }}
                            >
                                <div style={{
                                    fontWeight: 'bold',
                                    width: '200px',
                                    color: '#34495e'
                                }}>
                                    {key}:
                                </div>
                                <div style={{ color: '#666' }}>
                                    {value}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResponseViewer;