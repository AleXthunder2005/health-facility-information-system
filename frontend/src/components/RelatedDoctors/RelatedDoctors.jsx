import { useContext } from "react";
import { AppContext } from "@context/AppContext";
import { useNavigate } from "react-router-dom";

const RelatedDoctors = ({ speciality, docId }) => {

    const { doctors } = useContext(AppContext);
    const navigate = useNavigate();

    const related = doctors
        .filter((doc) => doc.speciality === speciality && doc._id !== docId)
        .slice(0, 4);

    if (related.length === 0) return null;

    return (

        <section className="max-w-7xl mx-auto">

            <h2 className="text-2xl font-semibold mb-6">
                Похожие специалисты
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

                {related.map((item) => (

                    <div
                        key={item._id}
                        className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-lg transition"
                    >

                        <div className="w-full h-44 rounded-xl overflow-hidden bg-white mb-3">

                            <img
                                src={
                                    import.meta.env.VITE_BACKEND_URL +
                                    "/images/" +
                                    item.image
                                }
                                className="w-full h-full object-contain"
                            />

                        </div>

                        <h3 className="text-lg font-semibold">
                            {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                            {item.label}
                        </p>

                        <p className="text-sm text-gray-500">
                            {item.degree}
                        </p>

                        <button
                            onClick={() => {
                                navigate(`/appointment/${item._id}`);
                                window.scrollTo({ top: 0 });
                            }}
                            className="w-full mt-3 bg-primary text-white px-5 py-2 rounded-full text-sm hover:opacity-90 transition"
                        >
                            Записаться
                        </button>

                    </div>

                ))}

            </div>

        </section>

    );

};

export default RelatedDoctors;