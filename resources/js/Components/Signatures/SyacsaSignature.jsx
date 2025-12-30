export default function SyacsaSignature({ name, position, phone, email, photoUrl }) {
    return (
        <table border="0" cellPadding="0" cellSpacing="0" width="100%" style={{ width: '100%', maxWidth: '400px', backgroundColor: '#ffffff', fontFamily: "'Poppins', Helvetica", border: 'none', borderCollapse: 'collapse' }}>
            <tbody>
                <tr>
                    <td>
                        <p style={{ margin: 0, textAlign: 'left' }}>
                            <a style={{ display: 'block' }} href="https://syacsa.com/" target="_blank" rel="noreferrer">
                                <img src="https://syacsa.com/signatures/global-files/animated-logo.gif" style={{ width: '100%', display: 'block', maxWidth: '150px', textAlign: 'center', height: 'auto' }} alt="Syacsa" />
                            </a>
                        </p>
                    </td>
                    <td>
                        <table border="0" cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td style={{ paddingRight: '6pt' }}>
                                        <img
                                            style={{ margin: '0', verticalAlign: 'middle', height: '70px', width: '70px', borderRadius: '50%', objectFit: 'cover' }}
                                            src={photoUrl || "https://maguissa.com/wp-content/uploads/profile-fallback.jpeg"}
                                            width="70"
                                            height="70"
                                            alt="Profile"
                                        />
                                    </td>
                                    <td>
                                        <table border="0" cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <span style={{ display: 'block', fontSize: '14pt', color: '#000000', backgroundColor: 'transparent', fontWeight: 'bold' }}>
                                                            {name || 'Rubi Urrutia'}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <span style={{ fontSize: '10pt', color: '#ed1c24', fontWeight: 'normal' }}>
                                                            {position || 'Ventas & Marketing'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2" style={{ paddingTop: '8pt' }}>
                                        <hr style={{ height: '1px', borderWidth: 0, color: '#ed1c24', backgroundColor: '#ed1c24', margin: 0 }} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <table border="0" cellPadding="0" cellSpacing="0" style={{ marginTop: '5pt' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: 'middle', paddingRight: '3pt' }}>
                                                        <img style={{ display: 'block', verticalAlign: 'middle', height: 'auto' }} src="https://syacsa.com/signatures/global-files/phone.png" width="15" alt="Phone" />
                                                    </td>
                                                    <td style={{ verticalAlign: 'middle' }}>
                                                        <a href={`https://wa.me/+52${phone ? phone.replace(/[^0-9]/g, '') : '844297773'}`} style={{ color: '#636466', textDecoration: 'none', fontSize: '10pt', lineHeight: '1.4em' }} target="_blank" rel="noreferrer">
                                                            <b style={{ fontWeight: 'normal' }}>{phone || '844297773'}</b>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <table border="0" cellPadding="0" cellSpacing="0" style={{ marginTop: '1pt' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: 'middle', paddingRight: '3pt' }}>
                                                        <img style={{ display: 'block', verticalAlign: 'middle', height: 'auto' }} src="https://syacsa.com/signatures/global-files/email.png" width="15" alt="Email" />
                                                    </td>
                                                    <td style={{ verticalAlign: 'middle' }}>
                                                        <a href={`mailto:${email || 'rubi.urrutia@syacsa.com'}`} style={{ color: '#636466', textDecoration: 'none', fontSize: '10pt', lineHeight: '1.4em' }} target="_blank" rel="noreferrer">
                                                            <b style={{ fontWeight: 'normal' }}>{email || 'rubi.urrutia@syacsa.com'}</b>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <table border="0" cellPadding="0" cellSpacing="0" style={{ marginTop: '1pt' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: 'middle', paddingRight: '3pt' }}>
                                                        <img style={{ display: 'block', verticalAlign: 'middle', height: 'auto' }} src="https://syacsa.com/signatures/global-files/link.png" width="15" alt="Web" />
                                                    </td>
                                                    <td style={{ verticalAlign: 'middle' }}>
                                                        <a href="https://syacsa.com/" style={{ color: '#636466', textDecoration: 'none', fontSize: '10pt', lineHeight: '1.4em' }} target="_blank" rel="noreferrer">
                                                            <b style={{ fontWeight: 'normal' }}>syacsa.com</b>
                                                        </a>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <table border="0" cellPadding="0" cellSpacing="0" style={{ marginTop: '1pt' }}>
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: 'middle', paddingRight: '3pt' }}>
                                                        <img style={{ display: 'block', verticalAlign: 'middle', height: 'auto' }} src="https://syacsa.com/signatures/global-files/encuesta.png" width="18" alt="Survey" />
                                                    </td>
                                                    <td style={{ verticalAlign: 'middle' }}>
                                                        <a href="https://syacsa.com/encuesta-de-satisfaccion/" style={{ color: '#ed1c24', textDecoration: 'none', fontSize: '10pt', lineHeight: '1.4em' }} target="_blank" rel="noreferrer">
                                                            <em style={{ fontWeight: 'normal', fontStyle: 'italic' }}>Responde nuestra encuesta</em>
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
                    <td colSpan="3">
                        <p style={{ margin: '15px 0', textAlign: 'left' }}>
                            <a style={{ display: 'block' }} href="https://syacsa.com/marcas/" target="_blank" rel="noreferrer">
                                <img src="https://syacsa.com/signatures/global-files/marcas.jpg" alt="Brands" style={{ width: '100%', display: 'block', maxWidth: '600px', textAlign: 'center', height: 'auto' }} />
                            </a>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}
