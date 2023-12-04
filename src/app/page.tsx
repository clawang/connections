'use client'
import { useState, useEffect, useRef, SyntheticEvent } from 'react';
import { GameData } from './types';
import { addGame } from '../firebase/firebase';
import './App.scss'

export default function Home() {
  const [slug, setSlug] = useState<string>("");
  const [data, setData] = useState<GameData>({
    categories: [
      {
        title: "",
        level: 0,
        members: []
      },
      {
        title: "",
        level: 1,
        members: []
      }, {
        title: "",
        level: 2,
        members: []
      }, {
        title: "",
        level: 3,
        members: []
      },
    ],
    title: "",
  });
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
      const {result, error} = await addGame(data);
      console.log(result);
      setSlug(result.id);
    } else {
      alert('Not all fields are filled out!');
    }
  }

  const copyToClipboard = (e: SyntheticEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("http://localhost:3000/"+slug);
  }

  // console.log(data);

  return (
    <div className="container">
      <h1>Custom Connections</h1>
      <form>
        <label>
          <h3>Title</h3>
          <input type="text" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
        </label>
        <h3>Categories</h3>
        <div className="category-form-wrapper">
          <label>
            <h4>Title</h4>
            <input type="text" value={data.categories[0].title} onChange={(e) => handleChangeTitle(e.target.value, 0)} />
          </label>
          <div className="category-items-wrapper">
            <label>
              <h4>Item 1</h4>
              <input type="text" value={data.categories[0].members[0]} onChange={(e) => handleChangeItem(e.target.value, 0, 0)} />
            </label>
            <label>
              <h4>Item 2</h4>
              <input type="text" value={data.categories[0].members[1]} onChange={(e) => handleChangeItem(e.target.value, 0, 1)} />
            </label>
            <label>
              <h4>Item 3</h4>
              <input type="text" value={data.categories[0].members[2]} onChange={(e) => handleChangeItem(e.target.value, 0, 2)} />
            </label>
            <label>
              <h4>Item 4</h4>
              <input type="text" value={data.categories[0].members[3]} onChange={(e) => handleChangeItem(e.target.value, 0, 3)} />
            </label>
          </div>
        </div>
        <div className="category-form-wrapper">
          <label>
            <h4>Title</h4>
            <input type="text" value={data.categories[1].title} onChange={(e) => handleChangeTitle(e.target.value, 1)} />
          </label>
          <div className="category-items-wrapper">
            <label>
              <h4>Item 1</h4>
              <input type="text" value={data.categories[1].members[0]} onChange={(e) => handleChangeItem(e.target.value, 1, 0)} />
            </label>
            <label>
              <h4>Item 2</h4>
              <input type="text" value={data.categories[1].members[1]} onChange={(e) => handleChangeItem(e.target.value, 1, 1)} />
            </label>
            <label>
              <h4>Item 3</h4>
              <input type="text" value={data.categories[1].members[2]} onChange={(e) => handleChangeItem(e.target.value, 1, 2)} />
            </label>
            <label>
              <h4>Item 4</h4>
              <input type="text" value={data.categories[1].members[3]} onChange={(e) => handleChangeItem(e.target.value, 1, 3)} />
            </label>
          </div>
        </div>
        <div className="category-form-wrapper">
          <label>
            <h4>Title</h4>
            <input type="text" value={data.categories[2].title} onChange={(e) => handleChangeTitle(e.target.value, 2)} />
          </label>
          <div className="category-items-wrapper">
            <label>
              <h4>Item 1</h4>
              <input type="text" value={data.categories[2].members[0]} onChange={(e) => handleChangeItem(e.target.value, 2, 0)} />
            </label>
            <label>
              <h4>Item 2</h4>
              <input type="text" value={data.categories[2].members[1]} onChange={(e) => handleChangeItem(e.target.value, 2, 1)} />
            </label>
            <label>
              <h4>Item 3</h4>
              <input type="text" value={data.categories[2].members[2]} onChange={(e) => handleChangeItem(e.target.value, 2, 2)} />
            </label>
            <label>
              <h4>Item 4</h4>
              <input type="text" value={data.categories[2].members[3]} onChange={(e) => handleChangeItem(e.target.value, 2, 3)} />
            </label>
          </div>
        </div>
        <div className="category-form-wrapper">
          <label>
            <h4>Title</h4>
            <input type="text" value={data.categories[3].title} onChange={(e) => handleChangeTitle(e.target.value, 3)} />
          </label>
          <div className="category-items-wrapper">
            <label>
              <h4>Item 1</h4>
              <input type="text" value={data.categories[3].members[0]} onChange={(e) => handleChangeItem(e.target.value, 3, 0)} />
            </label>
            <label>
              <h4>Item 2</h4>
              <input type="text" value={data.categories[3].members[1]} onChange={(e) => handleChangeItem(e.target.value, 3, 1)} />
            </label>
            <label>
              <h4>Item 3</h4>
              <input type="text" value={data.categories[3].members[2]} onChange={(e) => handleChangeItem(e.target.value, 3, 2)} />
            </label>
            <label>
              <h4>Item 4</h4>
              <input type="text" value={data.categories[3].members[3]} onChange={(e) => handleChangeItem(e.target.value, 3, 3)} />
            </label>
          </div>
        </div>
        <button onClick={handleSubmit}>Submit</button>
      </form>
      {slug ?
        <div className="game-link" ref={linkRef}>
          <h3>Here&apos;s your game link!</h3>
          <input type="text" readOnly value={"http://localhost:3000/" + slug}/>
          <button onClick={copyToClipboard}>Copy Link</button>
        </div>
        :
        <></>
      }
    </div>
  );
}
