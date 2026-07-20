import AudioLoader from "../../../../components/loaders/AudioLoader";


const ConfirmModal = ({ 
    isOpen, 
    title = "Confirm Action", 
    message, 
    onConfirm, 
    onClose, 
    isLoading = false 
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-secondary border border-white/15 p-8 max-w-md w-full space-y-6 shadow-2xl">
                <div>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-red-400 block">
                        Warning
                    </span>
                    <h3 className="mt-1 text-2xl font-medium uppercase italic text-white">
                        {title}
                    </h3>
                </div>

                <div className="text-sm text-white/70 leading-relaxed">
                    {message}
                </div>

                <div className="flex justify-end items-center gap-4 pt-4 border-t border-white/10">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onClose}
                        className="
                            px-5 py-2.5
                            border border-white/20
                            text-white/70 text-xs uppercase tracking-[0.15em]
                            transition-all duration-300
                            hover:border-white hover:text-white
                            disabled:opacity-50 cursor-pointer
                        "
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className="
                            min-w-[130px] min-h-[38px]
                            flex items-center justify-center gap-2
                            px-5 py-2.5
                            border border-red-500
                            bg-red-500 text-white
                            text-xs uppercase tracking-[0.15em] font-medium
                            transition-all duration-300
                            hover:bg-transparent hover:text-red-400
                            disabled:opacity-50 cursor-pointer
                        "
                    >
                        {isLoading ? (
                            <>
                               
                                <AudioLoader height={20} width={20} color="#f87171" />
                                <span className="text-xs tracking-widest">LOADING...</span>
                            </>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;