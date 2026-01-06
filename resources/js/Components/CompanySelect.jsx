import { useState } from 'react';

export default function CompanySelect({ value, onChange, companies = [] }) {
    const [isOpen, setIsOpen] = useState(false);

    const selectedCompany = companies.find(c => c.id == value);

    return (
        <div className="relative w-full">
            {/* Dropdown Button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-4 py-3 text-left bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition duration-150 ease-in-out"
            >
                {selectedCompany ? (
                    <div className="flex items-center gap-3">
                        {selectedCompany.logo ? (
                            <img
                                src={selectedCompany.logo}
                                alt={selectedCompany.name}
                                className="w-10 h-10 object-contain rounded-md bg-white border border-gray-100"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                {selectedCompany.name.charAt(0)}
                            </div>
                        )}
                        <span className="text-gray-900 font-medium">
                            {selectedCompany.name}
                        </span>
                    </div>
                ) : (
                    <span className="text-gray-500">
                        -- Selecciona una empresa --
                    </span>
                )}

                {/* Chevron Icon */}
                <svg
                    className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Menu Items */}
                    <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {companies.map((company) => (
                            <button
                                key={company.id}
                                type="button"
                                onClick={() => {
                                    onChange(company.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors duration-150 ease-in-out ${value === company.id
                                    ? 'bg-primary/10'
                                    : 'bg-white hover:bg-gray-50'
                                    }`}
                            >
                                {company.logo ? (
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-10 h-10 object-contain rounded-md bg-white border border-gray-100"
                                    />
                                ) : (
                                    <div className="w-10 h-10 rounded-md bg-gray-100 flex items-center justify-center text-gray-400 font-bold border border-gray-200">
                                        {company.name.charAt(0)}
                                    </div>
                                )}
                                <span className="text-gray-900 font-medium">
                                    {company.name}
                                </span>

                                {/* Checkmark for selected */}
                                {value === company.id && (
                                    <svg
                                        className="ml-auto w-5 h-5 text-primary"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
