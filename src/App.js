import { descending, text } from "d3";
import "./style.css";
import { useEffect, useState } from "react";
import supabase from "./supabase";

const initialFacts = [
  {
    id: 1,
    text: "React is being developed by Meta (formerly facebook)",
    source: "https://opensource.fb.com/",
    category: "technology",
    votesInteresting: 24,
    votesMindblowing: 9,
    votesFalse: 4,
    createdIn: 2021,
  },
  {
    id: 2,
    text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
    source:
      "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
    category: "society",
    votesInteresting: 11,
    votesMindblowing: 2,
    votesFalse: 0,
    createdIn: 2019,
  },
  {
    id: 3,
    text: "Lisbon is the capital of Portugal",
    source: "https://en.wikipedia.org/wiki/Lisbon",
    category: "society",
    votesInteresting: 8,
    votesMindblowing: 3,
    votesFalse: 1,
    createdIn: 2015,
  },
];

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <span style={{ fontSize: "40px" }}>{count}</span>

      <button
        className="btn btn-all_cat"
        onClick={(count) => setCount((c) => c + 1)}
      >
        +1
      </button>
    </div>
  );
}

function App() {
  const [showForm, setShowForm] = useState(false);
  const [facts, setFacts] = useState(initialFacts);

  const [isloading, setIsLoading] = useState(false);

  const [currentCategory, setCurrentCatrgory] = useState("all");

  useEffect(
    function () {
      setIsLoading(true);

      async function getFacts() {
        let query = supabase.from("facts").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: facts, error } = await query
          .order("created_at", { descending: true })
          .limit(1000);

        if (!error) setFacts(facts);
        else alert("There was some error loading the data ");

        setIsLoading(false);
      }
      getFacts();
    },
    [currentCategory]
  );

  return (
    <>
      {/* HEADER */}
      <Header showForm={showForm} setShowForm={setShowForm} />
      <Counter />
      {showForm ? (
        <NewFactForm setFacts={setFacts} setShowForm={setShowForm} />
      ) : null}

      <main className="main">
        <CategoryFilter setCurrentCatrgory={setCurrentCatrgory} />
        {isloading ? (
          <Loader />
        ) : (
          <FactList facts={facts} setFacts={setFacts} />
        )}
        ;
      </main>
    </>
  );
}

function Loader() {
  return <p className="message">Loading...</p>;
}

function Header({ setShowForm, showForm }) {
  const handleToggle = () => {
    setShowForm((current) => !current);
  };
  const AppTitle = "Today I Learned";
  return (
    <header className="header">
      <div className="logo">
        <img src="logo.png" alt="image of me" height="68" width="68" />
        <h1>{AppTitle}</h1>
      </div>

      <button className="btn btn-open" onClick={handleToggle}>
        {showForm ? "Close" : "Share a Fact"}
      </button>
    </header>
  );
}

const CATEGORIES = [
  { name: "technology", color: "#3b82f6" },
  { name: "science", color: "#16a34a" },
  { name: "finance", color: "#ef4444" },
  { name: "society", color: "#eab308" },
  { name: "entertainment", color: "#db2777" },
  { name: "health", color: "#14b8a6" },
  { name: "history", color: "#f97316" },
  { name: "news", color: "#8b5cf6" },
];

function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}

function NewFactForm({ setFacts, setShowForm }) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [isUploading, setisUploading] = useState(false);
  const [category, setCategory] = useState("");

  async function handleSubmit(e) {
    // 1. Prevent Browser Reset
    e.preventDefault();
    console.log(text, source, category);

    // 2. Check if Data is valid , if so create a new fact
    if (text && isValidHttpUrl(source) && category && text.length <= 200) {
      // 3. Create a new fact object

      // const newFact = {
      //   id: Math.round(Math.random() * 100000000),
      //   text,
      //   source,
      //   category,
      //   votesInteresting: 0,
      //   votesMindblowing: 0,
      //   votesFalse: 0,
      //   createdIn: new Date().getFullYear(),
      // };

      // Create new fact in Supabase

      setisUploading(true);
      const { data: newFact, error } = await supabase
        .from("facts")
        .insert([{ text, source, category }])
        .select();

      setisUploading(false);
      // 4. Add new fact to the UI : add the fact to the state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);
      // 5. Reset input fields

      setText("");
      setSource("");
      setCategory("");
      // Close the form

      setShowForm(false);
    }
  }

  // const [letters, setLetters] = useState(200);

  return (
    <form className="fact-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Share a fact with the world..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={isUploading}
      />
      <span>{200 - text.length}</span>
      <input
        type="text"
        placeholder="trustworthy source..."
        value={source}
        onChange={(e) => setSource(e.target.value)}
        disabled={isUploading}
      />

      <select
        name=""
        id=""
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose Category</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>

      <button className="btn btn-large" disabled={isUploading}>
        Post
      </button>
    </form>
  );
}

function CategoryFilter({ setCurrentCatrgory }) {
  return (
    <aside>
      <ul>
        <li className="category">
          <button
            className="btn btn-all_cat"
            onClick={() => setCurrentCatrgory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-catrgory"
              style={{
                backgroundColor: cat.color,
              }}
              onClick={() => setCurrentCatrgory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function FactList({ facts, setFacts }) {
  // const Facts = initialFacts;

  if (facts.length === 0) {
    return (
      <p className="message">
        No facts availbale for this category yet ! Create the first one
      </p>
    );
  }

  return (
    <section>
      <ul className="facts-list">
        {facts.map((fact) => (
          <Fact key={fact.id} fact={fact} setFacts={setFacts} />
        ))}
      </ul>
      <p>There are {facts.length} facts in the database.</p>
    </section>
  );
}

function Fact({ fact, setFacts }) {
  const [isUpdating, setIsupdating] = useState(false);
  async function handleVote(columnName) {
    setIsupdating(true);
    const { data: updateFact, error } = await supabase
      .from("facts")
      .update({ [columnName]: fact[columnName] + 1 })
      .eq("id", fact.id)
      .select();

    setIsupdating(false);
    console.log(updateFact);

    if (!error)
      setFacts((facts) =>
        facts.map((f) => (f.id === fact.id ? updateFact[0] : f))
      );
  }
  return (
    <li className="fact">
      <p>
        {fact.text}
        <a className="source" href={fact.source} target="_blank">
          (source)
        </a>
      </p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === fact.category)
            .color,
        }}
      >
        {fact.category}
      </span>
      <div className="vote-buttons">
        <button onClick={() => handleVote("votesInteresting")}>
          👍 {fact.votesInteresting}
        </button>
        <button onClick={() => handleVote("votesMindblowing")}>
          😒 {fact.votesMindblowing}
        </button>
        <button onClick={() => handleVote("votesFalse")}>
          ❤️ {fact.votesFalse}
        </button>
      </div>
    </li>
  );
}

export default App;
