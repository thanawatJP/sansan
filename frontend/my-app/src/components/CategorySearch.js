import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import { SearchByCategoryApi } from '../store/thread';
import { ThreadListApi } from '../store/thread';
import { BeatLoader } from 'react-spinners';

function CategorySearch() {
    const [threads, setThreads] = useState(null);
    const { category_id } = useParams(); // Get category_id from URL parameters
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategoryThreads = async () => {
            setLoading(true);
            try {
                const response = await SearchByCategoryApi(category_id);
                setResults(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching category threads:', err);
                setError('Failed to load category threads');
                setLoading(false);
            }
        };

        fetchCategoryThreads();
    }, [category_id]);

    const fetchThreads = async () => {
        ThreadListApi()
            .then(response => {
                setThreads(response.data);
                console.log(response.data);
                setLoading(false); // ตั้งค่า loading เป็น false
                console.log(response.data)
            })
            .catch(err => {
                console.error('Error fetching Threads:', err);
                setError('Failed to load threads');
                setLoading(false); // ตั้งค่า loading เป็น false
            });
    }

    useEffect(() => {
        fetchThreads();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
                <BeatLoader color="#Fdba74" size={25} />
            </div>
        );
    }
    if (error) return <p>{error}</p>;

    return (
        <div className="flex flex-col items-center bg-orange-50 p-4 w-full min-h-full h-auto">
            {results && results.length > 0 ? (
                results.map((thread) => (
                    <ThreadItem key={thread.id} thread={thread} fetchThreads={fetchThreads} />
                ))
            ) : (
                <h2 className="text-2xl">ไม่พบกระทู้ในหมวดหมู่นี้</h2>
            )}
        </div>
    );
}

export default CategorySearch;
