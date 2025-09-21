'use client'
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { createData } from '@/lib/firebaseAction';
import { encryptSecure } from '@/lib/crypt';
import { useEditor } from '@tiptap/react';
import { SimpleEditor } from '@/components/tiptap-templates/simple/simple-editor';
// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
const CreateRecipeComp = () => {
    const { data: session } = useSession();
    const [form, setForm] = useState({
        title: '',
        description: '',
        image: '',
    });
    const [loading, setLoading] = useState(false);

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
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
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content: '',

    })

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session?.uid) return toast.error('You must be logged in');

        const instructions = editor?.getHTML() || '';

        if (!form.title || !instructions) {
            return toast.error('Please fill all required fields');
        }

        try {
            setLoading(true);
            await createData('recipeList', {
                title: form.title,
                description: form.description || '',
                image: form.image || '',
                instructions: instructions,
                created_at: Date.now(),
                user_id: session.uid,
            });
            toast.success('Recipe saved successfully!');
            setForm({ title: '', description: '', image: '' });
            editor?.commands.setContent('');
        } catch (err) {
            console.error(err);
            toast.error('Error saving recipe');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md mt-12 mb-12">
            <h1 className="text-2xl font-bold mb-6 text-black">Create Recipe</h1>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Recipe Title */}
                <input
                    type="text"
                    name="title"
                    placeholder="Recipe Title *"
                    className="border px-3 py-2 rounded"
                    value={form.title}
                    onChange={handleChange}
                    required
                />

                {/* Description */}
                <input
                    type="text"
                    name="description"
                    placeholder="Description (optional)"
                    className="border px-3 py-2 rounded"
                    value={form.description}
                    onChange={handleChange}
                />

                {/* Image URL */}
                <input
                    type="text"
                    name="image"
                    placeholder="Image URL (optional)"
                    className="border px-3 py-2 rounded"
                    value={form.image}
                    onChange={handleChange}
                />
                {/* Instructions & Ingredients */}
                <div className="flex flex-col">
                    <label className="block mb-1 font-medium">Instructions & Ingredients *</label>
                    <div className="border rounded p-2 min-h-[200px] focus-within:ring-2 focus-within:ring-green-400">
                        <SimpleEditor editor={editor} />
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                    disabled={loading}
                >
                    {loading ? 'Saving...' : 'Save Recipe'}
                </button>
            </form>
        </div>
    );
};

export default CreateRecipeComp;
