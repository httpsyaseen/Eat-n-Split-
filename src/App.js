import { useState } from "react";
import "./App.css";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onClick }) {
  return (
    <button onClick={onClick} className="button">
      {children}
    </button>
  );
}

export default function App() {
  const [showAddFriend, setAddFriend] = useState(false);
  const [friendList, setFriendList] = useState(initialFriends);
  const [selectFriend, setSelectFriend] = useState(null);

  function handleShowAddFriend() {
    setAddFriend((show) => !show);
  }

  function handleFriends(newFriend) {
    setFriendList((friend) => [...friend, newFriend]);
    setAddFriend(false);
  }

  function handleSelectFriend(friend) {
    setSelectFriend(friend);
  }

  function handleSplitForm(oldfriend, balance) {
    setFriendList((friends) =>
      friends.map((friend) => {
        if (friend.id === oldfriend.id) {
          return { ...oldfriend, balance };
        }
        return friend;
      })
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friendList}
          handleSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />

        {showAddFriend && <FormAddFriend addfriends={handleFriends} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close " : "Add Friend"}
        </Button>
      </div>

      {selectFriend && (
        <FormSplitBill
          handleSplitForm={handleSplitForm}
          selectFriend={selectFriend}
        />
      )}
    </div>
  );
}

function FriendList({ friends, handleSelectFriend, selectFriend }) {
  return (
    <ul>
      {friends.map((friends) => (
        <Friend
          friend={friends}
          key={friends.id}
          handleSelectFriend={handleSelectFriend}
          selectFriend={selectFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, handleSelectFriend, selectFriend }) {
  const isSelected = selectFriend && selectFriend.id === friend.id;
  //
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>

      {friend.balance < 0 && (
        <p className="red">You owe him Rs{Math.abs(friend.balance)}/-</p>
      )}

      {friend.balance > 0 && (
        <p className="green">He owes You Rs{friend.balance}/-</p>
      )}

      {friend.balance === 0 && <p>You and him are even</p>}
      <Button
        onClick={() => {
          isSelected ? handleSelectFriend(null) : handleSelectFriend(friend);
        }}
      >
        {isSelected ? "Close" : "Open"}
      </Button>
    </li>
  );
}

function FormAddFriend({ addfriends }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    if (!name || !image) return;

    const id = crypto.randomUUID();
    const newFriend = {
      name,
      image: `${image}?${id}`,
      id,
      balance: 0,
    };

    addfriends(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label> Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label> Image Url</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ selectFriend, handleSplitForm }) {
  const [bill, setBill] = useState("");
  const [yourExpense, setYourExpense] = useState("");
  const [whoisPaying, setWhoIsPaying] = useState("user");

  const friendExpense = bill * 1 - yourExpense;

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill && !yourExpense) return;

    let balance;

    if (whoisPaying === "user") {
      balance = selectFriend.balance + friendExpense;
    } else {
      balance = selectFriend.balance - yourExpense;
    }
    handleSplitForm(selectFriend, balance);
    setBill("");
    setYourExpense("");
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>Split a Bill with {selectFriend.name}</h2>

      <label> Bill Value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => {
          setBill(e.target.value);
        }}
      />

      <label>Your Expense</label>
      <input
        type="text"
        value={yourExpense}
        onChange={(e) => {
          setYourExpense(e.target.value);
        }}
      />

      <label> {selectFriend.name}'s Expense</label>
      <input type="text" value={friendExpense} disabled />

      <label> Who is paying the bill</label>
      <select
        value={whoisPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="you">You</option>
        <option value={selectFriend.name}>{selectFriend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
