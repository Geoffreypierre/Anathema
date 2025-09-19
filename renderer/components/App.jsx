import React, { useState, useEffect } from 'react';
import { useAppStore } from '../state/store';
import Sidebar from './Sidebar';
import NewRequest from '../pages/NewRequest';
import History from '../pages/History';
import Collections from '../pages/Collections';
import mainIcon from '/img/main.png';
import aboutIcon from '/img/about.png';



const App = () => {
    const { currentView, setCurrentView, loadData } = useAppStore();

    useEffect(() => {
        loadData();

        const handleMenuAction = (event, action) => {
            switch (action) {
                case 'menu-new-request':
                    setCurrentView('newRequest');
                    break;
                case 'menu-show-history':
                    setCurrentView('history');
                    break;
                case 'menu-show-collections':
                    setCurrentView('collections');
                    break;
            }
        };

        if (window.electronAPI) {
            window.electronAPI.onMenuAction(handleMenuAction);
            return () => window.electronAPI.removeAllListeners();
        }
    }, []);

    const renderCurrentView = () => {
        switch (currentView) {
            case 'history':
                return <History />;
            case 'collections':
                return <Collections />;
            default:
                return <NewRequest />;
        }
    };

    return (
        <div>
            <div className="topbar" style={{ fontFamily: 'Spectral SC' }}>
                <img className='main' src={mainIcon} />
                <span>ANATHEMA</span>
            </div>
            <div className="main-container">
                <Sidebar />
                <div style={{ flex: 1, overflow: 'auto' }}>
                    {renderCurrentView()}
                </div>
            </div>
        </div >
    );
};

export default App;