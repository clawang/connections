'use client'
import { useState, useEffect } from 'react';
import { getDataFromSlug } from '../../firebase/firebase';
import { GameData } from '../types';
import Link from 'next/link';
import Connections from './connections';
import '../App.scss';

const games = [
  [
    {
      level: 0,
      title: "ROOMMATES",
      members: ["Abraham", "Will", "Brian", "Roberto"]
    },
    {
      level: 1,
      title: "FAMILY",
      members: ["Alex", "Leyla", "Apol", "Moe"]
    },
    {
      level: 2,
      title: "COUSINS",
      members: ["Tara", "Kelly", "Mei Mei", "Andrew"]
    },
    {
      level: 3,
      title: "FRIENDS",
      members: ["Rosy", "Tyler", "Calvin", "Justin"]
    },
  ],
  [
    {
      level: 0,
      title: "PEOPLE WHO HAVE LIVED IN SAN FRANCISCO",
      members: ["Claire", "Salima", "Jackie", "Raymond"]
    },
    {
      level: 1,
      title: "PEOPLE WHO WENT TO SEA",
      members: ["Tim", "Klem", "Julie", "Anya"]
    },
    {
      level: 2,
      title: "PEOPLE WHO GO UPSTATE",
      members: ["KLi", "Taylor", "Kevin", "Alexis"]
    },
    {
      level: 3,
      title: "PEOPLE WHO HAVE BEEN NAKED IN HERALD",
      members: ["Camilla", "Kwang", "Le", "Roju"]

    },
  ],
];

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
      setData(data.result);
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
            <Connections gameData={gameData} />
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
