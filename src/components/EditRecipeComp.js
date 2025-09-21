'use client'
import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { getDataId, updateData } from '@/lib/firebaseAction';
import { useEditor } from '@tiptap/react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"

const EditRecipeComp = ({ recipeId }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [form, setForm] = useState({ title: '', description: '', image: '' });
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({ horizontalRule: false }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
        ],
        content: '',
        editorProps: { attributes: { class: "simple-editor" } },
        immediatelyRender: false
    });

    // Fetch existing recipe
    useEffect(() => {
        if (!recipeId) return;
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const data = await getDataId('recipeList', recipeId);
                if (!data) {
                    toast.error('Recipe not found');
                    return;
                }
                setForm({
                    title: data.title || '',
                    description: data.description || '',
                    image: data.image || '',
                });
                editor?.commands.setContent(data.instructions || '');
            } catch (err) {
                console.error(err);
                toast.error('Error fetching recipe');
            } finally {
                setLoading(false);
            }
        };
        fetchRecipe();
    }, [recipeId, editor]);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.uid) return toast.error('You must be logged in');

        const instructions = editor?.getHTML() || '';
        if (!form.title || !instructions) return toast.error('Please fill all required fields');

        try {
            setLoading(true);
            await updateData('recipeList', recipeId, {
                title: form.title,
                description: form.description || '',
                image: form.image || '', // fallback to old image if empty
                instructions,
                updated_on: Date.now(), // <-- save update timestamp
            });
            toast.success('Recipe updated successfully!');
            router.back(); // redirect after save
        } catch (err) {
            console.error(err);
            toast.error('Error updating recipe');
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <div className="text-center mt-12">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12 mb-12">
            <h1 className="text-2xl font-bold mb-6 text-black">Edit Recipe</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Recipe Title *"
                    className="border px-3 py-2 rounded"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="description"
                    placeholder="Description (optional)"
                    className="border px-3 py-2 rounded"
                    value={form.description}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="image"
                    placeholder="Image URL"
                    className="border px-3 py-2 rounded"
                    value={form.image}
                    onChange={handleChange}
                />
                {form.image && <img src={form.image} alt="Preview" className="w-32 h-32 object-cover rounded mt-2" />}
                <div className="flex flex-col">
                    <label className="block mb-1 font-medium">Instructions & Ingredients *</label>
                    <div className="border rounded p-2 min-h-[200px] focus-within:ring-2 focus-within:ring-green-400">
                        <SimpleEditor editor={editor} />
                    </div>
                </div>
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Update Recipe'}
                </button>
            </form>
        </div>
    );
};

export default EditRecipeComp;
