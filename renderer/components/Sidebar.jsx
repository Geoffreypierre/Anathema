import React from 'react';
import { useAppStore } from '../state/store';
import plusIcon from '/img/plus.png';
import historyIcon from '/img/history.png';
import collectionIcon from '/img/folder.png';

const Sidebar = () => {
    const { currentView, setCurrentView, collections, history } = useAppStore();

    const menuItems = [
        { id: 'newRequest', label: 'New Request', icon: plusIcon },
        { id: 'collections', label: `Collections (${collections.length})`, icon: collectionIcon },
        { id: 'history', label: `History (${history.length})`, icon: historyIcon }
    ];

    return (
        <div style={{
            width: '280px',
            background: '#FDFDFD',
            borderRight: '1px solid #e0e0e0',
            padding: '30px 0',
            height: '100%'
        }}>
            {menuItems.map(item => (
                <div
                    key={item.id}
                    onClick={() => setCurrentView(item.id)}
                    style={{
                        padding: '16px 30px',
                        margin: '8px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        background: currentView === item.id ? '#F5F5F5' : 'transparent',
                        color: '#333',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '16px',
                        fontWeight: currentView === item.id ? '600' : '400',
                        border: currentView === item.id ? '1px solid #e8f5e8' : '1px solid transparent'
                    }}
                >
                    <img
                        src={item.icon}
                        alt={item.label}
                        style={{
                            width: '18px',
                            height: '18px',
                            filter: currentView === item.id ? 'none' : 'grayscale(100%)'
                        }}
                    />
                    <span>{item.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Sidebar;