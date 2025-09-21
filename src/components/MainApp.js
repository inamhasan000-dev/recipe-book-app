import React, { useEffect, useState } from 'react';
import Modal from './Modal';
import { createData, getDataByKey } from '@/lib/firebaseAction';
import { decryptSecure, encryptSecure } from '@/lib/crypt';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Loader from './Loader';

const MainApp = () => {
    const { data: session } = useSession();
    const [loader, setLoader] = useState(true)
    const [createModal, setCreateModal] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [revealKey, setRevealKey] = useState('');
    const [selectedView, setSelectedView] = useState({ string: '' });
    const [data, setData] = useState([]);
    const [form, setForm] = useState({
        text: '',
        string: '',
        tag: '',
        hint: '',
    });

    const handleOpenCreate = () => setCreateModal(true);
    const handleCloseCreate = () => setCreateModal(false);

    const handleOpenView = (item) => {
        setViewModal(true);
        setSelectedView(item);
    };

    const handleCloseView = () => {
        setViewModal(false);
        setSelectedView({ string: '' });
        setRevealKey('');
    };

    const handleGetPosts = async () => {
        try {
            setLoader(true)
            if (!session?.uid) return;
            const res = await getDataByKey(session.uid, 'user_id', 'recipeList');
            setData(res);
            setLoader(false)
        } catch {
            (e) => {
                setLoader(false)
            }
        }
    };

    useEffect(() => {
        if (session?.uid) handleGetPosts();
    }, [session?.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createData('recipeList', {
                text: encryptSecure(form.text, form.string),
                tag: form.tag,
                hint: form.hint,
                created_at: Date.now(),
                user_id: session?.uid,
            });
            setCreateModal(false);
            setForm(
                {
                    text: '',
                    string: '',
                    tag: '',
                    hint: '',
                }
            )
            toast.success('Saved Successfully');
            handleGetPosts();
        } catch (err) {
            toast.error('Error saving data');
            console.error(err);
        }
    };

    const handleOnChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleOnSecretChange = (key) => {
        setRevealKey(key);
        try {
            const revealed = decryptSecure(selectedView.text, key);
            setSelectedView((prev) => ({
                ...prev,
                revealed,
            }));
        } catch (err) {
            setSelectedView((prev) => ({
                ...prev,
                revealed: '',
            }));
        }
    };

    return (
        <>
            {loader ? <Loader /> :
                <div className="flex gap-4 flex-wrap mx-auto max-w-[1072px] justify-start">
                    <div
                        onClick={handleOpenCreate}
                        className="bg-zinc-800 border border-gray-50 rounded-lg min-w-64 min-h-40 flex justify-center items-center cursor-pointer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 4.5v15m7.5-7.5h-15"
                            />
                        </svg>
                    </div>

                    {data?.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => handleOpenView(item)}
                            className="relative bg-zinc-800 border border-gray-50 rounded-lg min-w-64 min-h-40 flex justify-center items-center cursor-pointer"
                        >
                            <p className="absolute top-1 right-1 bg-gray-300 text-gray-950 text-xs px-1 rounded-md">
                                {item?.tag}
                            </p>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                                />
                            </svg>
                        </div>
                    ))}
                </div>
            }

            {/* Create Modal */}
            <Modal isOpen={createModal} onClose={handleCloseCreate}>
                <form
                    method="POST"
                    className="flex flex-col gap-4 pt-5"
                    onSubmit={handleSubmit}
                >
                    <input
                        required
                        type="text"
                        placeholder="Secret"
                        className="border px-3 py-2 rounded bg-black text-white"
                        maxLength={100}
                        name="text"
                        onChange={handleOnChange}
                        value={form.text}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Magic word"
                        className="border px-3 py-2 rounded bg-black text-white"
                        maxLength={100}
                        name="string"
                        onChange={handleOnChange}
                        value={form.string}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Tag"
                        className="border px-3 py-2 rounded bg-black text-white"
                        maxLength={10}
                        name="tag"
                        onChange={handleOnChange}
                        value={form.tag}
                    />
                    <input
                        required
                        type="text"
                        placeholder="Hint"
                        className="border px-3 py-2 rounded bg-black text-white"
                        maxLength={100}
                        name="hint"
                        onChange={handleOnChange}
                        value={form.hint}
                    />
                    <input
                        type="submit"
                        className="bg-gray-800 text-white px-4 py-2 rounded"
                    />
                </form>
            </Modal>

            {/* View Modal */}
            <Modal isOpen={viewModal} onClose={handleCloseView}>
                <div className="flex flex-col gap-4 pt-5">
                    {selectedView?.revealed ? (
                        <div>{selectedView.revealed}</div>
                    ) : (
                        <img
                            className="w-full max-h-8 object-cover filter grayscale"
                            src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2o3NzNoYmhtYjJrZzczYW0wc3FiZ28wbjN0aDBqdmQxYndsb25nbiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YRcXl6VfNhCorklI0R/giphy.gif"
                            alt="locked"
                        />
                    )}
                    <input
                        type="text"
                        placeholder="Secret"
                        className="border px-3 py-2 rounded bg-black text-white"
                        maxLength={100}
                        value={revealKey}
                        onChange={(e) => handleOnSecretChange(e.target.value)}
                    />
                    <div
                        title={`${selectedView?.hint}`}
                        className="w-fit flex font-extralight text-sm items-center gap-1 cursor-default"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
                            />
                        </svg>
                        hint
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default MainApp;
