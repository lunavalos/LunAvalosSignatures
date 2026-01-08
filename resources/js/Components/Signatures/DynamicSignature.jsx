import React from 'react';

export default function DynamicSignature({ html, data }) {
    // Default values if data is empty
    const placeholders = {
        name: data.name || 'Nombre del Empleado',
        position: data.position || 'Puesto / Cargo',
        phone: data.phone || '1234567890',
        email: data.email || 'nombre@empresa.com',
        photo: data.photoUrl || 'https://maguissa.com/wp-content/uploads/profile-fallback.jpeg'
    };

    // Replace placeholders in the HTML string
    let processedHtml = html || '';

    Object.keys(placeholders).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, 'g');
        processedHtml = processedHtml.replace(regex, placeholders[key]);
    });

    return (
        <div
            className="dynamic-signature-container"
            dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
    );
}


