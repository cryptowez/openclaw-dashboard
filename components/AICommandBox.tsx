// Updated AICommandBox.tsx

import React from 'react';

const AICommandBox = () => {
    const [selectedModel, setSelectedModel] = React.useState<string>('');

    const fetchAPIData = async () => {
        try {
            const response = await fetch('https://api.example.com/data');
            const data = await response.json();
            console.log(data);
            // Process the data as needed
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    React.useEffect(() => {
        fetchAPIData();
    }, []);

    return (
        <div>
            <h1>AI Command Box</h1>
            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="model1">Model 1</option>
                <option value="model2">Model 2</option>
            </select>
        </div>
    );
};

export default AICommandBox;