import React, { useState, useEffect } from 'react';
import { useAppStore } from '../state/store';
import { ApiService } from '../services/ApiService';
import RequestForm from '../components/RequestForm';
import ResponseViewer from '../components/ResponseViewer';

const NewRequest = () => {
    const { addToHistory, saveCollection, collections } = useAppStore();
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentRequest, setCurrentRequest] = useState(null);
    const [collectionName, setCollectionName] = useState('');
    const [showSaveDialog, setShowSaveDialog] = useState(false);

    useEffect(() => {
        const handleSendRequest = () => {
            if (currentRequest) {
                handleRequest(currentRequest);
            }
        };

        if (window.electronAPI) {
            window.electronAPI.onMenuAction((event, action) => {
                if (action === 'menu-send-request') {
                    handleSendRequest();
                }
            });
        }
    }, [currentRequest]);

    const handleRequest = async (requestData) => {
        setCurrentRequest(requestData);
        setLoading(true);
        setError(null);
        setResponse(null);

        try {
            const result = await ApiService.sendRequest(requestData);
            setResponse(result);
            addToHistory({
                ...requestData,
                response: result,
                timestamp: new Date().toISOString()
            });
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveToCollection = () => {
        if (!currentRequest) return;

        if (collectionName.trim()) {
            saveCollection(collectionName.trim(), {
                ...currentRequest,
                name: `${currentRequest.method} ${new URL(currentRequest.url).pathname}`,
                id: Date.now().toString()
            });
            setCollectionName('');
            setShowSaveDialog(false);
        }
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{
                padding: '20px',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <h1 style={{ margin: 0 }}>New Request</h1>
                {currentRequest && (
                    <button
                        onClick={() => setShowSaveDialog(true)}
                        style={{
                            padding: '8px 16px',
                            background: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                        }}
                    >
                        Save to Collection
                    </button>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex' }}>
                <div style={{
                    width: '50%',
                    borderRight: '1px solid #eee',
                    overflow: 'auto'
                }}>
                    <RequestForm onSubmit={handleRequest} />
                </div>

                <div style={{ width: '50%', overflow: 'auto' }}>
                    <ResponseViewer
                        response={response}
                        loading={loading}
                        error={error}
                    />
                </div>
            </div>

            {showSaveDialog && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '8px',
                        minWidth: '300px'
                    }}>
                        <h3>Save to Collection</h3>
                        <input
                            type="text"
                            value={collectionName}
                            onChange={(e) => setCollectionName(e.target.value)}
                            placeholder="Collection name"
                            style={{
                                width: '100%',
                                padding: '10px',
                                marginBottom: '20px',
                                border: '1px solid #ddd',
                                borderRadius: '4px'
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <button
                                onClick={() => setShowSaveDialog(false)}
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #ddd',
                                    borderRadius: '4px',
                                    background: 'white',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveToCollection}
                                style={{
                                    padding: '8px 16px',
                                    background: '#27ae60',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewRequest;