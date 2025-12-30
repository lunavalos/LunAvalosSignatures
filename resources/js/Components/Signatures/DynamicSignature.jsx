import React from 'react';

export default function DynamicSignature({ html, data }) {
    // Default values if data is empty
    const placeholders = {
        name: data.name || 'Nombre del Empleado',
        position: data.position || 'Puesto / Cargo',
        phone: data.phone || '0000000000',
        email: data.email || 'correo@ejemplo.com',
        photo: data.photoUrl || 'https://syacsa.com/wp-content/uploads/2023/06/user-placeholder.png'
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
