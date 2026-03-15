import { assets } from "../assets/assets.js";

const CancelModal = ({ appointment, onClose, onConfirm }) => {
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-2xl p-8 w-[400px] shadow-xl relative">

                <button onClick={onClose} className="absolute right-4 top-4">
                    <img src={assets.cross_icon} className="w-5" />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    Отмена записи
                </h2>

                <p className="text-gray-600 mb-6">
                    Вы уверены что хотите отменить запись?
                </p>

                <div className="flex gap-4 justify-between">

                    <button
                        onClick={onClose}
                        className="px-7 py-1 border hover:border-primary transition rounded-lg"
                    >
                        Нет
                    </button>

                    <button
                        onClick={onConfirm}
                        className="px-7 py-1 bg-primary hover:bg-primary-light transition text-white rounded-lg"
                    >
                        Да
                    </button>

                </div>

            </div>

        </div>
    );
};

export default CancelModal;
