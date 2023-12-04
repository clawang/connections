import { useState, useEffect, SyntheticEvent } from 'react';
import { GameData, GameLevel, GameItem } from '../types';
import Link from 'next/link';
import '../App.scss';

function Connections({ gameData }: { gameData: GameData }) {
    const [items, setItems] = useState<Array<GameItem>>([]);
    const [completed, setCompleted] = useState<Array<GameLevel>>([]);
    const [history, setHistory] = useState<Array<Array<number>>>([]);
    const [numSelected, setNumSelected] = useState(0);
    const [mistakes, setMistakes] = useState(4);
    const [gameState, setGameState] = useState(0); // 0 playing, 1 is lost, 2 is won

    // manage UI
    const [toast, setToast] = useState("");
    const [popup, setPopup] = useState(false);
    const [answerIndex, setAnswerIndex] = useState(0);

    useEffect(() => {
        setItems(getItems(gameData.categories));
    }, [gameData]);

    const getItems = (categories: Array<GameLevel>) => {
        let arr = new Array<GameItem>();
        let index = 0;
        categories.forEach(category => {
            category.members.forEach(item => {
                let obj = {} as GameItem;
                obj.level = category.level;
                obj.title = item;
                obj.selected = false;
                obj.id = index;
                arr.push(obj);
                index++;
            });
        });
        shuffle(arr);
        return arr;
    }

    const splitRows = () => {
        let rows = [];
        for (let i = 0; i < items.length; i += 4) {
            rows.push({ items: items.slice(i, i + 4) });
        }
        return rows;
    }

    const renderBubbles = () => {
        let bubbles = [];
        for (let i = 0; i < mistakes; i++) {
            bubbles.push("bubble");
        }
        return bubbles;
    }

    const itemSelected = (id: number) => {
        const newItems = [...items];
        const selectedItem = newItems.find(item => item.id === id);
        if (!selectedItem || (numSelected >= 4 && !selectedItem.selected)) return;
        if (selectedItem.selected) {
            setNumSelected(numSelected - 1);
        } else {
            setNumSelected(numSelected + 1);
        }
        selectedItem.selected = !selectedItem.selected;
        setItems(newItems);
    }

    const shuffleItems = () => {
        setItems(shuffle([...items]));
    }

    const deselectAll = () => {
        const newItems = [...items];
        newItems.forEach(item => item.selected = false);
        setItems(newItems);
        setNumSelected(0);
    }

    const removeMistake = () => {
        setItems([...items].map(item => {
            item.mistake = false;
            return item;
        }));
        if (mistakes <= 1) {
            setGameState(1);
            revealAnswer(answerIndex);
        }
        setMistakes(mistakes - 1);
        setToast("");
    }

    const checkSubmit = () => {
        let levelsSelected: Array<number> = [];
        let incorrect = 0;
        let level = -1;
        const newItems = [...items];
        newItems.forEach(item => {
            if (item.selected) {
                if (level < 0) {
                    level = item.level;
                } else if (item.level !== level) {
                    incorrect++;
                }
                levelsSelected.push(item.level);
            }
        });
        if (incorrect === 0) {
            setCompleted([...completed, gameData.categories[level]]);
            newItems.sort((a, b) => {
                if (a.selected) return -1;
                else if (b.selected) return 1;
                return 0;
            });
            for (let i = 0; i < 4; i++) {
                newItems.shift();
            }
            setItems(newItems);
            setNumSelected(0);
        } else {
            let oneAway = incorrect === 1 || incorrect === 3;
            newItems.forEach(item => { if (item.selected) item.mistake = true }); // set mistake class on item for animation
            setItems(newItems);
            if (oneAway) {
                setToast("One away!");
            }
            setTimeout(() => removeMistake(), 1000);
        }
        setHistory([...history, levelsSelected]);
    }

    useEffect(() => {
        if (completed.length >= 4) {
            gameOver();
        } else if (gameState === 1) {
            setTimeout(() => revealAnswer(answerIndex), 1000);
        }
    }, [completed]);

    const revealAnswer = (index: number) => {
        setAnswerIndex(answerIndex+1);
        if (completed.findIndex(row => row.level === index) < 0) {
            const newItems = [...items];
            newItems.sort((a, b) => {
                if (a.level === index) return -1;
                else if (b.level === index) return 1;
                return 0;
            });
            for (let i = 0; i < 4; i++) {
                newItems.shift();
            }
            setCompleted([...completed, gameData.categories[index]]);
            setItems(newItems);
        } else {
            revealAnswer(index+1);
        }
    }

    const gameOver = () => {
        if (gameState === 0) setGameState(2);
        setTimeout(() => {
            setPopup(true);
        }, 1000);
    }

    return (
        <>
            <div id="toast" className={toast.length > 0 ? "show" : ""}><p>{toast}</p></div>
            <PopUp state={gameState} title={gameData.title} history={history} popup={popup} setPopup={setPopup} />
            <div className="header">
                <div className="title">
                    <h1>Connections</h1>
                    <h2>{gameData.title}</h2>
                </div>
                <div className="nav-button"><Link href="/">Create new game</Link></div>
            </div>
            <p>Create four groups of four!</p>
            <div className="connections-wrapper">
                {completed.map((category, index) => <RowDone key={index} data={category} />)}
                {splitRows().map((row, index) => <RowItems key={index} items={row.items} itemSelected={itemSelected} />)}
            </div>
            {gameState === 0 ?
                <div className="mistakes-container">
                    <p>Mistakes remaining:</p>
                    <div className="bubbles-container">
                        {renderBubbles().map((bubble, index) => <div className="bubble" key={index}></div>)}
                    </div>
                </div>
                :
                <></>
            }
            <div className="buttons-wrapper">
                {gameState === 0 ?
                    <>
                        <button onClick={shuffleItems}>Shuffle</button>
                        <button id="deselect-all-button" onClick={deselectAll}>Deselect All</button>
                        <button id="submit-button" disabled={numSelected === 4 ? false : true} onClick={checkSubmit}>Submit</button>
                    </>
                    :
                    <button onClick={() => setPopup(true)}>View Results</button>
                }
            </div>
        </>
    );
}

function RowDone({ data }: { data: GameLevel }) {
    return (
        <div className={"row-complete-wrapper " + "level-" + data.level}>
            <div className="complete-header">
                <h3>{data.title}</h3>
            </div>
            <p>{data.members.join(", ")}</p>
        </div>
    );
}

function RowItems({ items, itemSelected }: { items: Array<GameItem>, itemSelected: (id: number) => void }) {
    return (<div className="row-wrapper">
        {items.map(item => <Item key={item.id} data={item} onSelect={() => itemSelected(item.id)} />)}
    </div>);
}

function Item({ data, onSelect }: { data: GameItem, onSelect: () => void }) {
    const handleClick = (event: SyntheticEvent) => {
        onSelect();
    }

    return (
        <div className={"item" + (data.selected ? " selected" : "") + (data.mistake ? " invalid-shake" : "")} onClick={handleClick}>
            {data.title}
        </div>
    );
}

function PopUp({ state, title, history, popup, setPopup }: {
    state: number,
    title: string,
    history: Array<Array<number>>,
    popup: boolean,
    setPopup: (popup: boolean) => void,
}) {

    const classNames = ["yellow", "green", "blue", "purple"];
    const emojis = ["🟨", "🟩", "🟦", "🟪"];

    const copyToClipboard = () => {
        let text = "Connections: " + title + "\n";
        for (const row of history) {
            for (const level of row) {
                text += emojis[level];
            }
            text += "\n";
        }
        navigator.clipboard.writeText(text);
    }

    return (
        <div id="popup" className={popup ? "show" : ""}>
            <div id="popup-content">
                <div className="close-x" onClick={() => setPopup(false)}></div>
                {
                    state === 2 ?
                        <>
                            <h2>Great!</h2>
                        </>
                        :
                        <>
                            <h2>Next Time!</h2>
                        </>
                }
                <h3>Connections: {title}</h3>
                <div id="emoji-recap">
                    {history.map(round => <div className="emoji-row">{round.map(item => <div className={"emoji " + classNames[item]}></div>)}</div>)}
                </div>
                <button onClick={copyToClipboard}>Share Your Results</button>
            </div>
        </div>
    );
}

function shuffle(array: Array<GameItem>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex > 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

export default Connections;