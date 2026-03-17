import { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";

const Services = () => {

    const {
        services,
        getServices,
        addService,
        updateService,
        deleteService
    } = useContext(AppContext);

    const [showModal, setShowModal] = useState(false);
    const [editService, setEditService] = useState(null);

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        getServices();
    }, []);

    const openModal = (service = null) => {
        setEditService(service);
        setName(service?.name || "");
        setPrice(service?.price || "");
        setShowModal(true);
    };

    const handleSave = async () => {
        if (!name || !price) return;

        let success;

        if (editService) {
            success = await updateService({
                serviceId: editService._id,
                name,
                price
            });
        } else {
            success = await addService({ name, price });
        }

        if (success) {
            setShowModal(false);
            setName("");
            setPrice("");
            setEditService(null);
        }
    };

    const handleDelete = async () => {
        const success = await deleteService(editService._id);
        if (success) {
            setShowModal(false);
            setEditService(null);
        }
    };

    return (
        <div className="p-6">

            <div className="flex justify-between mb-6">
                <h1 className="text-2xl font-semibold">Услуги</h1>

                <button
                    onClick={() => openModal()}
                    className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-light transition"
                >
                    Добавить
                </button>
            </div>

            {/* TABLE */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-gray-600">
                    <tr>
                        <th className="text-left p-3">Название</th>
                        <th className="text-right p-3">Цена</th>
                    </tr>
                    </thead>

                    <tbody>
                    {services.map((s) => (
                        <tr
                            key={s._id}
                            onClick={() => openModal(s)}
                            className="border-t cursor-pointer hover:bg-gray-50 transition"
                        >
                            <td className="p-3">{s.name}</td>
                            <td className="p-3 text-right">
                                {s.price} BYN
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-lg">

                        <h2 className="mb-4 font-semibold">
                            {editService ? "Редактировать" : "Добавить"}
                        </h2>

                        {/* NAME */}
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Название"
                            className="border border-gray-200 rounded-xl p-3 text-sm w-full mb-3
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />

                        {/* PRICE */}
                        <input
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="Цена"
                            className="border border-gray-200 rounded-xl p-3 text-sm w-full mb-3
                            focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        />

                        {/* SAVE */}
                        <button
                            onClick={handleSave}
                            className="bg-primary text-white w-full py-2 rounded-xl mb-2 hover:bg-primary-light transition"
                        >
                            Сохранить
                        </button>

                        {/* DELETE */}
                        {editService && (
                            <button
                                onClick={handleDelete}
                                className="bg-red-500 text-white w-full py-2 rounded-xl mb-2 hover:bg-red-600 transition"
                            >
                                Удалить
                            </button>
                        )}

                        {/* CANCEL */}
                        <button
                            onClick={() => {
                                setShowModal(false);
                                setEditService(null);
                            }}
                            className="border border-gray-200 w-full py-2 rounded-xl hover:bg-gray-100 transition"
                        >
                            Отмена
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Services;