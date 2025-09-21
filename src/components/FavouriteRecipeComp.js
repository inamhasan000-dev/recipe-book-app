'use client'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getDataByKey, deleteData, updateData } from '@/lib/firebaseAction';
import { toast } from 'sonner';

const FavouriteRecipeComp = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const [recipes, setRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRecipes, setFilteredRecipes] = useState([]);

    // Fetch recipes
    const fetchRecipes = async () => {
        if (!session?.uid) return;
        const data = await getDataByKey(session.uid, 'user_id', 'recipeList');
        setRecipes(data?.filter(x => x?.favourite) || []);
        setFilteredRecipes(data?.filter(x => x?.favourite) || []);
    };

    useEffect(() => {
        fetchRecipes();
    }, [session?.uid]);

    // Search filter
    useEffect(() => {
        if (!searchTerm) setFilteredRecipes(recipes);
        else {
            const filtered = recipes.filter((r) =>
                r.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRecipes(filtered);
        }
    }, [searchTerm, recipes]);

    // Delete recipe
    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this recipe?')) return;
        try {
            await deleteData('recipeList', id);
            toast.success('Recipe deleted successfully!');
            fetchRecipes();
        } catch (err) {
            console.error(err);
            toast.error('Failed to delete recipe.');
        }
    };

    // Toggle favourite
    const toggleFavourite = async (recipe) => {
        try {
            await updateData('recipeList', recipe.id, {
                favourite: !recipe.favourite,
            });
            fetchRecipes();
            toast.success(
                `Recipe ${!recipe.favourite ? 'added to' : 'removed from'} favourites!`
            );
        } catch (err) {
            console.error(err);
            toast.error('Failed to update favourite.');
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-6">


            {/* Search */}
            <input
                type="text"
                placeholder="Search recipes..."
                className="border px-3 py-2 rounded w-full mb-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredRecipes.length === 0 && (
                    <p className="text-white col-span-full text-center bg-green-600 w-fit m-auto p-2 rounded-3xl shadow-sm shadow-black">
                        No favourite recipes found
                    </p>
                )}

                {filteredRecipes.map((recipe) => (
                    <div
                        key={recipe.id}
                        className="cursor-pointer border rounded-lg overflow-hidden shadow hover:shadow-lg transition flex flex-col bg-gradient-to-br from-green-50 to-green-100 "
                    >
                        {/* Thumbnail */}
                        <div
                            className="h-40 w-full bg-gray-200 flex items-center justify-center overflow-hidden"
                            onClick={() => router.push(`/recipe/${recipe.id}`)}
                        >
                            {recipe.image ? (
                                <img
                                    src={recipe.image}
                                    alt={recipe.title}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <span className="text-gray-500">No Image</span>
                            )}
                        </div>

                        {/* Card content */}
                        <div className="p-3 flex-1 flex flex-col justify-between relative">
                            <h2 className="text-lg font-semibold text-gray-800 py-4">{recipe.title}</h2>
                            {recipe.description && (
                                <p className="text-sm text-gray-600 mt-1 truncate">{recipe.description}</p>
                            )}
                            {/* Action buttons */}
                            <div className="absolute top-2 right-2 flex gap-2">
                                {/* Favourite star */}
                                <button
                                    onClick={() => toggleFavourite(recipe)}
                                    className="text-lg"
                                >
                                    <img
                                        src={recipe.favourite ? "/star.svg" : "/star_empty.svg"}
                                        alt={recipe.favourite ? "Favourite" : "Not Favourite"}
                                        className="w-5 h-5"
                                    />
                                </button>
                                {/* Edit */}
                                <button
                                    onClick={() => router.push(`/edit/${recipe.id}`)}
                                    className="text-lg"
                                >
                                    <img src="/pencil.svg" alt="Delete" className="w-5 h-5" />
                                </button>
                                {/* Delete */}
                                <button
                                    onClick={() => handleDelete(recipe.id)}
                                    className="text-lg"
                                >
                                    <img src="/trash.svg" alt="Delete" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>


                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavouriteRecipeComp;
