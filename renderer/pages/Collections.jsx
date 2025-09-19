import React, { useState } from 'react';
import { useAppStore } from '../state/store';
import { ApiService } from '../services/ApiService';

const Collections = () => {
    const { collections, deleteCollection, setCurrentView } = useAppStore();
    const [selectedCollection, setSelectedCollection] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [flashMessage, setFlashMessage] = useState(null);

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

    const handleRunRequest = async (request) => {
        try {
            const result = await ApiService.sendRequest(request);
            alert(`Request completed: ${result.status} ${result.statusText}`);
        } catch (error) {
            alert(`Request failed: ${error.message}`);
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <h1 style={{ margin: 0 }}>Collections</h1>
            </div>

            {collections.length === 0 ? (
                <div style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#999'
                }}>
                    <p>No collections yet</p>
                    <button
                        onClick={() => setCurrentView('newRequest')}
                        style={{
                            padding: '10px 20px',
                            background: '#3498db',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Create your first request
                    </button>
                </div>
            ) : (
                <div style={{ flex: 1, display: 'flex' }}>
                    <div style={{
                        width: '30%',
                        borderRight: '1px solid #eee',
                        overflow: 'auto'
                    }}>
                        <div style={{ padding: '15px', fontWeight: 'bold', background: '#f8f9fa' }}>
                            Collections
                        </div>
                        {collections.map((collection, index) => (
                            <div
                                key={index}
                                onClick={() => {
                                    setSelectedCollection(collection);
                                    setSelectedRequest(null);
                                }}
                                style={{
                                    padding: '15px',
                                    borderBottom: '1px solid #eee',
                                    cursor: 'pointer',
                                    background: selectedCollection === collection ? '#e3f2fd' : 'white'
                                }}
                            >
                                <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                                    {collection.name}
                                </div>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {collection.requests.length} request{collection.requests.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{
                        width: '35%',
                        borderRight: '1px solid #eee',
                        overflow: 'auto'
                    }}>
                        {selectedCollection ? (
                            <div>
                                <div style={{
                                    padding: '15px',
                                    fontWeight: 'bold',
                                    background: '#f8f9fa',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <span>{selectedCollection.name}</span>
                                    <button
                                        onClick={() => {
                                            deleteCollection(selectedCollection.name)
                                            setFlashMessage(`Collection ${selectedCollection.name} supprimée !`);
                                            setTimeout(() => setFlashMessage(null), 2000);
                                        }}
                                        style={{
                                            padding: '4px 8px',
                                            background: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '3px',
                                            cursor: 'pointer',
                                            fontSize: '12px'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>

                                {selectedCollection.requests.map((request, index) => (
                                    <div
                                        key={index}
                                        onClick={() => setSelectedRequest(request)}
                                        style={{
                                            padding: '12px 15px',
                                            borderBottom: '1px solid #eee',
                                            cursor: 'pointer',
                                            background: selectedRequest === request ? '#f0f8ff' : 'white'
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                background: getMethodColor(request.method),
                                                color: 'white',
                                                padding: '2px 6px',
                                                borderRadius: '3px',
                                                fontSize: '10px',
                                                fontWeight: 'bold'
                                            }}>
                                                {request.method}
                                            </span>
                                            <span style={{ fontSize: '14px' }}>
                                                {request.name || new URL(request.url).pathname}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{
                                padding: '40px',
                                textAlign: 'center',
                                color: '#999'
                            }}>
                                Select a collection to view requests
                            </div>
                        )}
                    </div>

                    <div style={{ width: '35%', overflow: 'auto', padding: '20px' }}>
                        {selectedRequest ? (
                            <div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <h3 style={{ margin: 0 }}>
                                        {selectedRequest.name || 'Request Details'}
                                    </h3>
                                    <button
                                        onClick={() => handleRunRequest(selectedRequest)}
                                        style={{
                                            padding: '8px 16px',
                                            background: '#27ae60',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Run
                                    </button>
                                </div>

                                <div style={{ marginBottom: '15px' }}>
                                    <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                        <div><strong>Method:</strong> {selectedRequest.method}</div>
                                        <div><strong>URL:</strong> {selectedRequest.url}</div>
                                    </div>
                                </div>

                                {selectedRequest.headers && selectedRequest.headers.length > 0 && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <h4>Headers</h4>
                                        <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '4px' }}>
                                            {selectedRequest.headers.map((header, i) => (
                                                <div key={i} style={{ marginBottom: '5px', fontSize: '14px' }}>
                                                    <strong>{header.key}:</strong> {header.value}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRequest.body && (
                                    <div style={{ marginBottom: '15px' }}>
                                        <h4>Body</h4>
                                        <pre style={{
                                            background: '#f8f9fa',
                                            padding: '10px',
                                            borderRadius: '4px',
                                            overflow: 'auto',
                                            fontSize: '12px',
                                            maxHeight: '200px'
                                        }}>
                                            {selectedRequest.body}
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
            )
            }
        </div >
    );
};

export default Collections;