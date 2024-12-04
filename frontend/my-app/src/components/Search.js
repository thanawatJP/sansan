import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ThreadItem from './ThreadItem';
import { SearchThreadsApi } from '../store/thread';
import { ThreadListApi } from '../store/thread';
import { BeatLoader } from 'react-spinners';

function Search() {
    const [threads, setThreads] = useState(null);
    const [results, setResults] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = new URLSearchParams(useLocation().search).get('search'); // Get the search query from URL

    useEffect(() => {
        if (!query) {
            setResults([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        SearchThreadsApi(query)
            .then(response => {
                setResults(response.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching search results:', err);
                setError('Failed to load search results');
                setLoading(false);
            });
    }, [query]);

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
                    <ThreadItem key={thread.id} thread={thread}  fetchThreads={fetchThreads} />
                ))
            ) : (
                <h2 className="text-2xl">ไม่พบกระทู้</h2>
            )}
        </div>
    );
}

export default Search;
