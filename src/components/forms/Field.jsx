// src/components/forms/Field.jsx

const Field = ({
    name,
    label,
    value,
    onChange,
    onBlur,
    placeholder = "",
    type = "text",
    error = "",
    rows = 4,
    ...rest
}) => {
    const isTextarea = type === "textarea";

    // Style de base partagé entre input et textarea
    const inputStyles = `
        w-full
        rounded-xl
        border
        bg-blue-950/30
        px-4
        text-sm
        text-white
        placeholder:text-blue-100/40
        outline-none
        transition-all
        duration-300
        ${isTextarea ? "py-3" : "h-12"}

        ${
            error
                ? `
                    border-red-400/50
                    focus:border-red-300
                    focus:ring-4
                    focus:ring-red-500/20
                `
                : `
                    border-blue-800/60
                    hover:border-blue-500/60
                    focus:border-blue-300
                    focus:bg-blue-900/40
                    focus:ring-4
                    focus:ring-blue-400/20
                `
        }
    `;

    return (
        <div className="flex flex-col gap-2">
            <label
                htmlFor={name}
                className="
                    text-sm
                    font-medium
                    text-blue-100
                "
            >
                {label}
            </label>

            {isTextarea ? (
                <textarea
                    id={name}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder || label}
                    rows={rows}
                    className={inputStyles}
                    {...rest}
                />
            ) : (
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    placeholder={placeholder || label}
                    className={inputStyles}
                    {...rest}
                />
            )}

            {error && (
                <p className="
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-medium
                    text-red-300
                ">
                    <span className="text-xs">
                        ⚠
                    </span>
                    {error}
                </p>
            )}
        </div>
    );
};

export default Field;