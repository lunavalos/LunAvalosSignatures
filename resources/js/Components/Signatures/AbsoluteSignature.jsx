export default function AbsoluteSignature({ name: propName, position: propPosition, phone: propPhone, email: propEmail, photoUrl }) {
    // Use logical OR to ensure empty strings from form use the default values
    const name = propName || "Lic. Rocio Velez";
    const position = propPosition || "Director";
    const phone = propPhone || "(956) 727-6004";
    const email = propEmail || "rocio@absolute-fi.com";

    // Use the same fallback as Syacsa if no photo is selected
    const displayPhoto = photoUrl || "https://maguissa.com/wp-content/uploads/profile-fallback.jpeg";

    return (
        <table
            role="presentation"
            cellPadding="0"
            cellSpacing="0"
            border="0"
            style={{
                borderCollapse: 'collapse',
                backgroundColor: '#ffffff',
                fontFamily: "'Rubik', Arial, Helvetica, sans-serif",
                width: '100%',
                maxWidth: '390px'
            }}
        >
            <tbody>
                <tr>
                    <td style={{ padding: 0, verticalAlign: 'middle', width: '140px' }}>
                        <a href="https://absolute-fi.com/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', display: 'inline-block' }}>
                            <img
                                src="https://absolute-fi.com/signature/global-files/absolute-group.gif"
                                width="120"
                                alt="Absolute Group Inc."
                                style={{ display: 'block', border: 0, outline: 'none', width: '120px', height: 'auto' }}
                            />
                        </a>
                    </td>

                    <td style={{ padding: 0, verticalAlign: 'top' }}>
                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0 10px 0 0', verticalAlign: 'middle' }}>
                                        <img
                                            src={displayPhoto}
                                            width="70"
                                            alt={name}
                                            style={{
                                                display: 'block',
                                                border: 0,
                                                outline: 'none',
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '50%',
                                                objectFit: 'cover'
                                            }}
                                        />
                                    </td>
                                    <td style={{ padding: 0, verticalAlign: 'middle', width: '100%' }}>
                                        <table role="presentation" width="100%" cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse', width: '100%' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: '100%' }}>
                                                        <div style={{ margin: 0, padding: 0, fontSize: '14pt', lineHeight: 1.1, fontWeight: 700, color: '#000000', fontFamily: "'Rubik', Arial, Helvetica, sans-serif", width: '100%' }}>
                                                            {name}
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style={{ width: '100%' }}>
                                                        <div style={{ margin: 0, padding: 0, fontSize: '10pt', lineHeight: 1.2, fontWeight: 400, color: '#094293', paddingTop: '2px', fontFamily: "'Rubik', Arial, Helvetica, sans-serif", width: '100%' }}>
                                                            {position}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2" style={{ paddingTop: '8px' }}>
                                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: 0, verticalAlign: 'top' }}>
                                                        <table role="presentation" cellPadding="0" cellSpacing="0" border="0" style={{ borderCollapse: 'collapse' }}>
                                                            <tbody>
                                                                {/* Phone */}
                                                                <tr>
                                                                    <td style={{ padding: '2px 6px 2px 0', verticalAlign: 'middle' }}>
                                                                        <a href={`https://wa.me/${phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                            <img
                                                                                src="https://absolute-fi.com/wp-content/uploads/phone.png"
                                                                                width="15"
                                                                                alt="Phone"
                                                                                style={{ display: 'block', border: 0, outline: 'none', width: '15px', height: 'auto' }}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{ padding: '2px 0', verticalAlign: 'middle' }}>
                                                                        <a href={`https://wa.me/${phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#636466', fontSize: '9pt', lineHeight: 1.2 }}>
                                                                            {phone}
                                                                        </a>
                                                                    </td>
                                                                </tr>

                                                                {/* Email */}
                                                                <tr>
                                                                    <td style={{ padding: '2px 6px 2px 0', verticalAlign: 'middle' }}>
                                                                        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                            <img
                                                                                src="https://absolute-fi.com/wp-content/uploads/email.png"
                                                                                width="15"
                                                                                alt="Email"
                                                                                style={{ display: 'block', border: 0, outline: 'none', width: '15px', height: 'auto' }}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{ padding: '2px 0', verticalAlign: 'middle' }}>
                                                                        <a href={`mailto:${email}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: '#636466', fontSize: '9pt', lineHeight: 1.2 }}>
                                                                            {email}
                                                                        </a>
                                                                    </td>
                                                                </tr>

                                                                {/* Website */}
                                                                <tr>
                                                                    <td style={{ padding: '2px 6px 2px 0', verticalAlign: 'middle' }}>
                                                                        <a href="https://absolute-fi.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                            <img
                                                                                src="https://absolute-fi.com/wp-content/uploads/web.png"
                                                                                width="15"
                                                                                alt="Website"
                                                                                style={{ display: 'block', border: 0, outline: 'none', width: '15px', height: 'auto' }}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{ padding: '2px 0', verticalAlign: 'middle', fontSize: '10pt', lineHeight: 1.4, color: '#636466' }}>
                                                                        <a href="https://absolute-fi.com" target="_blank" rel="noopener noreferrer" style={{ color: '#636466', textDecoration: 'none' }}>
                                                                            absolute-fi.com
                                                                        </a>
                                                                    </td>
                                                                </tr>

                                                                {/* Survey */}
                                                                <tr>
                                                                    <td style={{ padding: '2px 6px 2px 0', verticalAlign: 'middle' }}>
                                                                        <a href="https://absolute-fi.com/satisfaction-survey/" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                                                            <img
                                                                                src="https://absolute-fi.com/wp-content/uploads/checklist-1.png"
                                                                                width="18"
                                                                                alt="Survey"
                                                                                style={{ display: 'block', border: 0, outline: 'none', width: '18px', height: 'auto' }}
                                                                            />
                                                                        </a>
                                                                    </td>
                                                                    <td style={{ padding: '2px 0', verticalAlign: 'middle', fontSize: '10pt', lineHeight: 1.4 }}>
                                                                        <a href="https://absolute-fi.com/satisfaction-survey/" target="_blank" rel="noopener noreferrer" style={{ color: '#094293', textDecoration: 'none', fontStyle: 'italic' }}>
                                                                            Take our survey
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>

                                                    <td style={{ padding: '0 0 0 14px', verticalAlign: 'middle' }}>
                                                        <a href="https://absolute-fi.com" target="_blank" rel="noopener noreferrer">
                                                            <img
                                                                src="https://absolute-fi.com/wp-content/uploads/absolute-QR.png"
                                                                width="78"
                                                                alt="QR Code"
                                                                style={{ display: 'block', border: 0, outline: 'none', width: '78px', height: '78px', borderRadius: '6px' }}
                                                            />
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>

                <tr>
                    <td colSpan="2" style={{ paddingTop: '12px' }}>
                        <img
                            src="https://absolute-fi.com/signature/global-files/lines.png"
                            alt=""
                            style={{ display: 'block', border: 0, outline: 'none', width: '100%', height: 'auto' }}
                        />
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
