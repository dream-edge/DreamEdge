import Link from "next/link";

/**
 * Button UI Components
 */
export const PrimaryButton = ({ children, disabled, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-blue-600 px-5 py-2.5 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg ${className || ""}`}
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({ children, disabled, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg bg-white px-5 py-2.5 text-gray-800 font-semibold border border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg ${className || ""}`}
    >
      {children}
    </button>
  );
};

export const DangerButton = ({ children, disabled, onClick, className, type = "button" }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 disabled:cursor-not-allowed transition-colors ${className || ""}`}
    >
      {children}
    </button>
  );
};

export const LinkButton = ({ children, href, className }) => {
  return (
    <Link
      href={href}
      className={`rounded-md bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors inline-block ${className || ""}`}
    >
      {children}
    </Link>
  );
};

/**
 * Form UI Components
 */
export const FormGroup = ({ children, className }) => {
  return <div className={`mb-6 ${className || ""}`}>{children}</div>;
};

export const Label = ({ children, htmlFor, required, className }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={`block text-base font-semibold text-gray-800 mb-2 ${className || ""}`}
    >
      {children}
      {required && <span className="text-red-600 font-bold ml-1">*</span>}
    </label>
  );
};

export const Input = ({ 
  id, 
  name, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required, 
  disabled,
  className 
}) => {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`block w-full rounded-lg border-gray-400 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm px-3 py-2 transition-all duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-500'} ${className || ""}`}
    />
  );
};

export const Textarea = ({ 
  id, 
  name, 
  placeholder, 
  value, 
  onChange, 
  required, 
  disabled,
  rows = 3,
  className 
}) => {
  return (
    <textarea
      id={id}
      name={name}
      rows={rows}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`block w-full rounded-lg border-gray-400 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm px-3 py-2 transition-all duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-500'} ${className || ""}`}
    />
  );
};

export const Select = ({ 
  id, 
  name, 
  value, 
  onChange, 
  required, 
  disabled,
  children,
  className 
}) => {
  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      disabled={disabled}
      className={`block w-full rounded-lg border-gray-400 shadow-sm focus:border-blue-600 focus:ring-1 focus:ring-blue-600 sm:text-sm px-3 py-2 transition-all duration-150 ease-in-out ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-500'} ${className || ""}`}
    >
      {children}
    </select>
  );
};

/**
 * Table UI Components
 */
export const Table = ({ children, className }) => {
  return (
    <div className="overflow-x-auto">
      <table className={`min-w-full divide-y divide-gray-200 ${className || ""}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children, className }) => {
  return (
    <thead className={`bg-gray-50 ${className || ""}`}>
      <tr>{children}</tr>
    </thead>
  );
};

export const TableHeadCell = ({ children, className }) => {
  return (
    <th
      scope="col"
      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${className || ""}`}
    >
      {children}
    </th>
  );
};

export const TableBody = ({ children, className }) => {
  return <tbody className={`bg-white divide-y divide-gray-200 ${className || ""}`}>{children}</tbody>;
};

export const TableRow = ({ children, className }) => {
  return <tr className={`hover:bg-gray-50 ${className || ""}`}>{children}</tr>;
};

export const TableCell = ({ children, className }) => {
  return <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${className || ""}`}>{children}</td>;
};

/**
 * Alert UI Components
 */
export const SuccessAlert = ({ title, message, onClose }) => {
  return (
    <div className="rounded-md bg-green-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium text-green-800">{title}</h3>}
          <p className="text-sm text-green-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const ErrorAlert = ({ title, message, onClose }) => {
  return (
    <div className="rounded-md bg-red-50 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium text-red-800">{title}</h3>}
          <p className="text-sm text-red-700 mt-1">{message}</p>
        </div>
        {onClose && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Loading UI Component
 */
export const LoadingSpinner = ({ size = "md", className }) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }[size];

  return (
    <div className={`flex justify-center items-center ${className || ""}`}>
      <svg className={`animate-spin text-blue-500 ${sizeClass}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>
  );
};

/**
 * Page Header UI Component
 */
export const PageHeader = ({ title, description, action }) => {
  return (
    <div className="mb-6 pb-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>
    </div>
  );
}; 