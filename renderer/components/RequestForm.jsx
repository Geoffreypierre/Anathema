import React, { useState } from 'react';

const RequestForm = ({ onSubmit, initialRequest = null }) => {
    const [method, setMethod] = useState(initialRequest?.method || 'GET');
    const [url, setUrl] = useState(initialRequest?.url || '');
    const [headers, setHeaders] = useState(initialRequest?.headers || [{ key: '', value: '' }]);
    const [body, setBody] = useState(initialRequest?.body || '');

    const methodColors = {
        'GET': '#65C754',
        'POST': '#C7C754',
        'PUT': '#547CC7',
        'DELETE': '#C75454',
        'PATCH': '#C79154'
    };

    const handleHeaderChange = (index, field, value) => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        if (index === headers.length - 1 && (value !== '')) {
            newHeaders.push({ key: '', value: '' });
        }

        const emptyHeaders = newHeaders.filter(h => h.key === '' && h.value === '');
        if (emptyHeaders.length >= 2) {
            const lastEmptyIndex = newHeaders.length - 1;
            if (newHeaders[lastEmptyIndex].key === '' && newHeaders[lastEmptyIndex].value === '') {
                newHeaders.pop();
            }
        }

        setHeaders(newHeaders);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filteredHeaders = headers.filter(h => h.key && h.value);
        onSubmit({
            method,
            url,
            headers: filteredHeaders,
            body: method !== 'GET' ? body : undefined
        });
    };

    return (
        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
            <div style={{ display: 'flex', marginBottom: '20px' }}>
                <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{
                        padding: '8px',
                        borderRadius: '4px',
                        borderTopRightRadius: '0',
                        borderBottomRightRadius: '0',
                        border: '1px solid #ddd',
                        borderRight: 'none',
                        color: methodColors[method],
                        fontWeight: '900',
                        fontFamily: 'inter',
                        outline: 'none',
                    }}
                >
                    <option style={{ color: '#65C754', fontWeight: '900', fontFamily: 'inter' }} value="GET">GET</option>
                    <option style={{ color: '#C7C754', fontWeight: '900', fontFamily: 'inter' }} value="POST">POST</option>
                    <option style={{ color: '#547CC7', fontWeight: '900', fontFamily: 'inter' }} value="PUT">PUT</option>
                    <option style={{ color: '#C75454', fontWeight: '900', fontFamily: 'inter' }} value="DELETE">DELETE</option>
                    <option style={{ color: '#C79154', fontWeight: '900', fontFamily: 'inter' }} value="PATCH">PATCH</option>
                </select>

                <input
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '4px',
                        borderTopLeftRadius: '0',
                        borderBottomLeftRadius: '0',
                        outline: 'none',
                        border: '1px solid #ddd'
                    }}
                    required
                />
            </div>

            <div style={{ marginBottom: '20px' }}>
                <h3>Headers</h3>
                {headers.map((header, index) => (
                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                        <input
                            placeholder="Header Key"
                            value={header.key}
                            onChange={(e) => handleHeaderChange(index, 'key', e.target.value)}
                            style={{
                                flex: 1,
                                padding: '6px',
                                borderRadius: '4px',
                                outline: 'none',
                                border: '1px solid #ddd'
                            }}
                        />
                        <input
                            placeholder="Header Value"
                            value={header.value}
                            onChange={(e) => handleHeaderChange(index, 'value', e.target.value)}
                            style={{
                                flex: 1,
                                padding: '8px',
                                borderRadius: '4px',
                                outline: 'none',
                                border: '1px solid #ddd'
                            }}
                        />
                    </div>
                ))}
            </div>

            {
                method !== 'GET' && (
                    <div>
                        <h3>Body</h3>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            placeholder="Request body (JSON, XML, etc.)"
                            rows="8"
                            style={{
                                width: '100%',
                                padding: '10px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                fontFamily: 'monospace'
                            }}
                        />
                    </div>
                )
            }

            <button
                type="submit"
                style={{
                    padding: '8px 20px',
                    background: '#65C754',
                    color: 'white',
                    fontSize: '16px',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                Send
            </button>
        </form >
    );
};

export default RequestForm;