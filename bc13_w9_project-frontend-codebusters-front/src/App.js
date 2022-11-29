import './App.css';
import { FilterBar } from './components/FilterBar/FilterBar.js'
import { Header } from './components/Header/Header.js'
import { Input } from './components/Input/Input.js'
import { ObjectList } from './components/ObjectList/ObjectList.js'
import { StartPage } from './components/StartPage/StartPage.js'
import { useState } from 'react'

const url = "http://localhost:3001/api"

function App() {

  // Object/or set of objects sent to ObjectList
  const [object, setObject] = useState([])
  // Input sent from FilterBar for the specific get request
  const [input, setInput] = useState("")
  // Foreign search input sent from FilterBar for the specific get request
  const [translateSearch, setTranslateSearch] = useState()
  // Visibility for the 'create new object' form
  const [isVisible, setVisible] = useState()
  // Visibility for the 'edit object' form
  const [isEditVisible, setEditVisible] = useState()
  // Start page visibility 
  const [isStartPageVisible, setIsStartPageVisible] = useState(true)
  // Id of the object to be edited
  const [editObject, setEditObject] = useState()
  // State for the favourites 
  const [faveArray, setfaveArray] = useState([])
  // State for languages
  const [language, setLanguage] = useState('englishDefinitions')


  // states for providing border around country buttons in header 
  
  const [isActive, setIsActive] = useState(false);
  const [isActiveES, setIsActiveES] = useState(false);
  const [isActiveFR, setIsActiveFR] = useState(false);
  const [isActiveDE, setIsActiveDE] = useState(false);

  // fetch request for all objects (called inside handleClick)

  async function getAllObjects() {
    const allObjects = await fetch(`${url}/${language}`);
    let data = await allObjects.json();
    return data.payload;
  }

  // fetch request for specific object(s) (called inside handleClick)

  async function getByTitle() {
    const titleObject = await fetch(`${url}/${language}/${input}`);
    let data = await titleObject.json();
    return data.payload;
  }

  // fetch request for specific object(s) in non-English language (called inside handleTranslation)

  async function getByForeignTitle() {
    const titleObject = await fetch(`${url}/${language}/english/${translateSearch}`);
    let data = await titleObject.json();
    return data.payload;
  }

  // post request for new object (handed down to input component)

  async function handleNewObject(newObject) {
    const objectToAdd = await fetch(`${url}/${language}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newObject)
    })
    let data = await objectToAdd.json();
    let brandNewObject = data.payload[0];
    const objectToAddOnScreen = [...object, brandNewObject];
    setObject(objectToAddOnScreen);
  }

  // function that toggles whether the 'Add New Resource' box is visible or not (toggled on button click)

  const handleVisibility = event => {
    setVisible(current => !current);
  }

  // edit request for specific object (handed down edit-sepcific input component)

  async function handleEdit(changes) {
    const targetEditObject = object.filter(itemToEdit => { return itemToEdit.id === editObject })
    const editedItem = createEditObject(targetEditObject, changes)
    await fetch(`${url}/${language}/${editObject}`, {
      method: 'PATCH',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editedItem[0])
    })
  }

  // Function that sets the editObject state to be the id of the item to edit (passed down to object list and mapped to object items) & calls the function that makes the edit input box visible 
  
  function handleObjectState(object) {
    setEditObject(object);
    handleVisibilityEdit();
  }

  // function that creates a new edited object (if values empty, original ones are kept) - called inside handleEdit 

  function createEditObject(original, newEdit) {

    if (language === 'englishDefinitions') {

      if (newEdit.title) {
        original[0].title = newEdit.title
      } if (newEdit.definition) {
        original[0].definition = newEdit.definition
      } if (newEdit.example) {
        original[0].example = newEdit.example
      } if (newEdit.links) {
        original[0].links = newEdit.links
      } if (newEdit.week) {
        original[0].week = newEdit.week
      }
    
    } else {

      if (newEdit.englishtitle) {
        original[0].englishtitle = newEdit.englishtitle
      } if (newEdit.title) {
        original[0].title = newEdit.title
      } if (newEdit.definition) {
        original[0].definition = newEdit.definition
      } if (newEdit.example) {
        original[0].example = newEdit.example
      } if (newEdit.links) {
        original[0].links = newEdit.links
      } if (newEdit.week) {
        original[0].week = newEdit.week
      }
    }
    return original
  }

  // function that toggles whether the 'Edit' box is visible or not (toggled on button click)

  const handleVisibilityEdit = event => {
    setEditVisible(current => !current);
  }
  
  // delete request for specific object (handed down to object list component and then object component)

  async function handleDelete(id) {
    for (let i = 0; i < object.length; i++) {
      if (object[i].id === id) {
        await fetch(`${url}/${language}/${id}`, {
          method: "DELETE"
        })
        const deleted = [...object.slice(0, i), ...object.slice(i + 1)];
        setObject(deleted);
      }
    } return
  }

  // function that: if no search input, runs get all and sorts objects alphabetically by title (when clicking search button); if there is search input, runs getByTitle function

  async function handleClick() {
    if (!input) {
      const objects = await getAllObjects()
      const sortedObjects = objects.sort((a, b) =>
        a.title?.localeCompare(b.title));
      setObject(sortedObjects);
    } else {
      const titleObject = await getByTitle();
      setObject(titleObject);
    }
  }

  // function that: if no translated search input, runs get all and sorts objects alphabetically by title (when clicking search button); if there is translated search input, runs getByForeignTitle function

  async function handleTranslation() {
    if (!translateSearch) {
      const objects = await getAllObjects();
      const sortedObjects = objects.sort((a, b) =>
        a.title?.localeCompare(b.title));
      setObject(sortedObjects);
    } else {
      const titleObject = await getByForeignTitle();
      setObject(titleObject);
    }
  }

  // function that is passed down to the filter bar that takes in the state of the the text input in the main search bar 

  function handleChange(e) {
    setInput(e.target.value);
  }

  // function that is passed down to the filter bar that takes in the state of the the text input in the translate search bar 

  function handleTranslateSearch(e) {
    setTranslateSearch(e.target.value);
  }

  // function that sorts the objects in ascending order (by week)

  function sortByWeek() {
    let sortedObjects = [...object].sort(function (a, b) { return a.week - b.week });
    setObject(sortedObjects);
  }

  // function that populates the new favourited items into the faveArray state

  function favourite(id) {
    const editFavourite = object.filter(fave => { return fave.id === id });
    const newArray = [...faveArray, editFavourite[0]];
    setfaveArray(newArray);
  }

  // function that displays the favourite list on button click 

  function displayFavourite() {
    setObject(faveArray);
    setIsActive(current => !current);
  }

  // functions for: choosing the language; handling the white borders around them when clicked in header; calling the changeStartState function to close the initial landing page (StartPage) 

  function handleClickSpanish() {
    setLanguage('spanishDefinitions');
    changeStartState();
    setIsActiveES(current => !current);
    setIsActive(false);
    setIsActiveDE(false);
    setIsActiveFR(false);
    setObject([]);
  }

  function handleClickFrench() {
    setLanguage('frenchDefinitions');
    changeStartState();
    setIsActiveFR(current => !current);
    setIsActive(false);
    setIsActiveDE(false);
    setIsActiveES(false);
    setObject([]);
  }

  function handleClickGerman() {
    setLanguage('germanDefinitions');
    changeStartState();
    setIsActiveDE(current => !current);
    setIsActive(false);
    setIsActiveFR(false);
    setIsActiveES(false);
    setObject([]);
  }

  function handleClickEnglish() {
    setLanguage('englishDefinitions');
    changeStartState();
    setIsActive(current => !current);
    setIsActiveES(false);
    setIsActiveFR(false);
    setIsActiveDE(false);
    setObject([]);
  }

  // function that toggles whether the StartPage is visible or not 

  const changeStartState = event => {
    if (isStartPageVisible) {
      setIsStartPageVisible(current => !current);
    }
  };

  return (
    <div className="App">
      <div className="start-page" style={{ visibility: isStartPageVisible ? 'visible' : 'hidden' }}>
        <StartPage changeSpanish={handleClickSpanish} changeEnglish={handleClickEnglish} changeGerman={handleClickGerman} changeFrench={handleClickFrench}></StartPage>
      </div>

      <div className="main-container">
        <div className="languages">
          <Header isActive={isActive} isActiveES={isActiveES} isActiveFR={isActiveFR} isActiveDE={isActiveDE} handleSpanish={handleClickSpanish} handleFrench={handleClickFrench} handleGerman={handleClickGerman} handleEnglish={handleClickEnglish}></Header>
        </div>

        <div className="search-bar">
          <FilterBar foreignClick={handleTranslation} language={language} handleClick={handleClick} handleTranslate={handleTranslateSearch} handleChange={handleChange} handleSort={sortByWeek} displayFave={displayFavourite}></FilterBar>
        </div>
      </div>

      <div className="form-container" style={{ visibility: isVisible ? 'visible' : 'hidden' }}>
        <Input visibility={handleVisibility} handleNewObject={handleNewObject} language={language}></Input>
      </div>

      <div className="form-container" style={{ visibility: isEditVisible ? 'visible' : 'hidden' }}>
        <Input visibility={handleVisibilityEdit} handleNewObject={handleEdit} language={language}></Input>
      </div>

      <div className="main-container">
        <button className="addNewButton" onClick={handleVisibility}>Add New Resource</button>
        <ObjectList object={object} handleFavourite={favourite} handleDelete={handleDelete} handleEdit={handleObjectState}></ObjectList>
      </div>
    </div>
  );
}

export default App;