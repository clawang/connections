'use client'
import { useState, useEffect, useRef, SyntheticEvent, MouseEvent } from 'react';
import { GameData } from './types';
import { addGame, updateGame } from '../firebase/firebase';
import './App.scss'

const URL = "https://custom-connections-game.vercel.app/";

export default function Home() {
  const [slug, setSlug] = useState<string>("");
  const [data, setData] = useState<GameData>({
    categories: [
      {
        title: "",
        level: 0,
        members: ["", "", "", ""]
      },
      {
        title: "",
        level: 1,
        members: ["", "", "", ""]
      }, {
        title: "",
        level: 2,
        members: ["", "", "", ""]
      }, {
        title: "",
        level: 3,
        members: ["", "", "", ""]
      },
    ],
    title: "",
    time_created: null,
  });
  const [buttonState, setButtonState] = useState<number>(0);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const linkRef = useRef(null);

  useEffect(() => {
    if (slug && linkRef.current) {
      (linkRef.current as HTMLElement).scrollIntoView({ behavior: 'smooth' });
    }
  }, [slug]);

  const handleChangeTitle = (str: string, level: number) => {
    const newCategories = [...data.categories];
    newCategories[level].title = str;
    setData({ ...data, categories: newCategories });
  }

  const handleChangeItem = (str: string, level: number, index: number) => {
    const newCategories = [...data.categories];
    newCategories[level].members[index] = str;
    setData({ ...data, categories: newCategories });
  }

  const moveUp = (event: MouseEvent, level: number) => {
    event.preventDefault();
    if (level <= 0) return;
    const newCategories = [...data.categories];
    const temp = data.categories[level];
    newCategories[level].level = level - 1;
    newCategories[level - 1].level = level;
    newCategories[level] = data.categories[level - 1];
    newCategories[level - 1] = temp;
    setData({ ...data, categories: newCategories });
  }

  const moveDown = (event: MouseEvent, level: number) => {
    event.preventDefault();
    if (level >= 3) return;
    const newCategories = [...data.categories];
    const temp = data.categories[level];
    newCategories[level].level = level + 1;
    newCategories[level + 1].level = level;
    newCategories[level] = data.categories[level + 1];
    newCategories[level + 1] = temp;
    setData({ ...data, categories: newCategories });
  }

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    let filled = true;
    if (data.title.length > 0) {
      data.categories.forEach(category => {
        if (category.title.length > 0) {
          category.members.forEach(member => {
            if (member.length <= 0) {
              filled = false;
            }
          });
        } else {
          filled = false;
        }
      });
    } else {
      filled = false;
    }
    if (filled) {
      const dataToSubmit = { ...data, time_created: new Date() };
      if (slug) {
        await updateGame(slug, dataToSubmit);
      } else if(!submitted) {
        setSubmitted(true);
        const { result, error } = await addGame(dataToSubmit);
        // console.log(result);
        setSlug(result.id);
      }
    } else {
      alert('Not all fields are filled out!');
    }
  }

  const copyToClipboard = (e: SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(URL + slug);
    setButtonState(1);
    setTimeout(() => setButtonState(0), 1000);
  }

  // console.log(data);

  return (
    <div className="container">
      <div className="container-header">
        <h1>Custom Connections</h1>
        <p>Create your own custom version of the <a href="https://www.nytimes.com/games/connections" target="_blank">NYT Connections game</a>!</p>
        <p>Not affiliated with the New York Times. Made by <a href="https://clawang.github.io/">Claire Wang</a>.</p>
        <div className="instructions">
          <h3>Difficulty Levels</h3>
          <ul className="help-emojis">
            <img id="help-arrow" src="https://www.nytimes.com/games-assets/v2/metadata/help_arrow.svg" alt="levels description arrow" />
            <div>
              <span className="help-emoji group-0"></span> Straightforward
            </div>
            <div>
              <span className="help-emoji group-1"></span>
            </div>
            <div>
              <span className="help-emoji group-2"></span>
            </div>
            <div>
              <span className="help-emoji group-3"></span> Tricky
            </div>
          </ul>
        </div>
      </div>
      <form>
        <label>
          <h3>Title</h3>
          <input type="text" maxLength={30} value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </label>
        <h3>Categories</h3>
        <CategoryForm
          data={data}
          level={0}
          moveUp={moveUp}
          moveDown={moveDown}
          handleChangeTitle={handleChangeTitle}
          handleChangeItem={handleChangeItem}
        />
        <CategoryForm
          data={data}
          level={1}
          moveUp={moveUp}
          moveDown={moveDown}
          handleChangeTitle={handleChangeTitle}
          handleChangeItem={handleChangeItem}
        />
        <CategoryForm
          data={data}
          level={2}
          moveUp={moveUp}
          moveDown={moveDown}
          handleChangeTitle={handleChangeTitle}
          handleChangeItem={handleChangeItem}
        />
        <CategoryForm
          data={data}
          level={3}
          moveUp={moveUp}
          moveDown={moveDown}
          handleChangeTitle={handleChangeTitle}
          handleChangeItem={handleChangeItem}
        />
        <button onClick={handleSubmit}>{slug ? "Update" : "Submit"}</button>
      </form>
      {
        (submitted && !slug) ?
        <p>Loading...</p>
        :
        <></>
      }
      {slug ?
        <div className="game-link" ref={linkRef}>
          <h3>Here&apos;s your game link!</h3>
          <input type="text" readOnly value={URL + slug} />
          <div className="buttons-wrapper">
            <button onClick={copyToClipboard}>{buttonState === 0 ? "Copy Link" : "Copied!"}</button>
            <button onClick={() => window.open("https://custom-connections-game.vercel.app/" + slug, "_blank")}>Go to Game</button>
          </div>
        </div>
        :
        <></>
      }
    </div>
  );
}

function CategoryForm({ data, level, moveUp, moveDown, handleChangeTitle, handleChangeItem }:
  {
    data: GameData,
    level: number,
    moveUp: (event: MouseEvent, level: number) => void,
    moveDown: (event: MouseEvent, level: number) => void,
    handleChangeTitle: (str: string, level: number) => void,
    handleChangeItem: (str: string, level: number, index: number) => void
  }) {
  return (
    <div className="category-form-wrapper">
      <div className="order-buttons">
        <button onClick={(e: MouseEvent) => moveUp(e, level)} disabled={level === 0 ? true : false}>▲</button>
        <button onClick={(e: MouseEvent) => moveDown(e, level)} disabled={level === 3 ? true : false}>▼</button>
      </div>
      <label>
        <h4>Title</h4>
        <input type="text" maxLength={50} value={data.categories[level].title} onChange={(e) => handleChangeTitle(e.target.value, level)} />
      </label>
      <div className="category-items-wrapper">
        <label>
          <h4>Item 1</h4>
          <input type="text" maxLength={15} value={data.categories[level].members[0]} onChange={(e) => handleChangeItem(e.target.value, level, 0)} />
        </label>
        <label>
          <h4>Item 2</h4>
          <input type="text" maxLength={15} value={data.categories[level].members[1]} onChange={(e) => handleChangeItem(e.target.value, level, 1)} />
        </label>
        <label>
          <h4>Item 3</h4>
          <input type="text" maxLength={15} value={data.categories[level].members[2]} onChange={(e) => handleChangeItem(e.target.value, level, 2)} />
        </label>
        <label>
          <h4>Item 4</h4>
          <input type="text" maxLength={15} value={data.categories[level].members[3]} onChange={(e) => handleChangeItem(e.target.value, level, 3)} />
        </label>
      </div>
    </div>
  );
}
