'use client'
import { useState, useEffect } from 'react';
import { getDataFromSlug } from '../../firebase/firebase';
import { GameData } from '../types';
import Link from 'next/link';
import Connections from './connections';
import '../App.scss';

function App({ params: { slug } }: {
  params: { slug: string }
}) {
  const [loading, setLoading] = useState(true);
  const [gameData, setData] = useState<GameData | null>(null);

  useEffect(() => {
    getData();
  }, [setData]);

  const getData = async () => {
    const data = await getDataFromSlug(slug);
    if (data.result) {
      console.log(data.result);
      setData(data.result);
      document.title = "Connections: " + data.result.title;
    }
    setLoading(false);
  }

  return (
    <div className="App">
      {loading ?
        <div className='page-wrapper'>
          <p>Loading...</p>
        </div>
        :
        <>
          {gameData ?
            <Connections gameData={gameData} slug={slug} />
            :
            <div className='page-wrapper'>
              <div className="error-page">
                <h1>Sorry, that game could not be found.</h1>
                <div className="nav-button"><Link href="/">Create a game</Link></div>
              </div>
            </div>
          }
        </>
      }
    </div>
  );
}

export default App;
