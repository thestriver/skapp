import {
  Header,
  Button,
  Input,
  Form,
  List,
  Dimmer,
  Loader,
  Image,
  Segment,
} from "semantic-ui-react";
import { SkynetClient } from "skynet-js";
import { ContentRecordDAC } from "@skynetlabs/content-record-library";
import { useState, useEffect } from "react";

// const portal =
//   window.location.hostname === "localhost" ? "https://siasky.net" : undefined;

// const client = new SkynetClient(portal);

const client = new SkynetClient();

export default function Dashboard() {
  // choose a data domain for saving files in MySky
  const dataDomain = "localhost";
  const dataKey = "";

  const handleMySkyLogout = async () => {
    const mySky = await client.loadMySky(dataDomain);

    // call logout to globally logout of mysky
    await mySky.logout();

    //set react state
    // setLoggedIn(false);
    // setUserID("");
    window.location.href = "/";
  };

  const [textMemory, updateTextMemory] = useState("");
  const [filePath, setFilePath] = useState();
  const [savedText, setSavedText] = useState();
  const [toDoItems, setToDoItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // When dataKey changes, update FilePath state.
  useEffect(() => {
    setFilePath(dataDomain + "/" + dataKey);
  }, [dataKey]);

  const submitToDo = async () => {
    // event.preventDefault();
    setLoading(true);
    console.log("to do submitted");

    // Upload user's file and get backs descriptor for our Skyfile
    const mem = JSON.stringify(textMemory);
    // const { skylink } = await client.uploadFile(mem);

    // skylinks start with `sia://` and don't specify a portal URL
    // we can generate URLs for our current portal though.
    // const skylinkUrl = await client.getSkylinkUrl(skylink);

    // console.log('To Do Uploaded:', skylinkUrl);
    const mySky = await client.loadMySky(dataDomain);

    const jsonData = {
      textMemory,
    };

    try {
      // Set discoverable JSON data at the given path. The return type is the same as getJSON.
      //   const { data, dataLink } =
      await mySky.setJSON(filePath, jsonData);
      const { data } = await mySky.getJSON(filePath);
      setToDoItems([
        ...toDoItems,
        {
          id: toDoItems.length,
          name: data.textMemory,
        },
      ]);
      setSavedText("");
      updateTextMemory("");
    } catch (error) {
      console.log(error);
    }
    setLoading(false);

    // updateTextMemory("");
  };

  const removeTodo = (index) => {
    let updatedTodoDos = [...toDoItems];
    updatedTodoDos.splice(index, 1);
    setToDoItems(updatedTodoDos);
  };

  return (
    <>
      <div style={{ margin: 100 }}>
        <Button
          onClick={handleMySkyLogout}
          style={{ float: "right" }}
          type="submit"
        >
          Log Out
        </Button>
        <div>
          <Header as="h1" style={{ margin: 100 }}>
            <div>My Task List</div>{" "}
          </Header>
        </div>
        <div>
          <Input
            value={textMemory}
            onChange={(e) => updateTextMemory(e.target.value)}
            focus
            placeholder="Add To Do..."
          />
          <Button onClick={submitToDo} type="submit">
            Submit
          </Button>
        </div>

        {/* Loading */}
        {loading ? (
          <Segment>
            <Dimmer active>
              <Loader>Loading</Loader>
            </Dimmer>

            <Image src="https://react.semantic-ui.com/images/wireframe/short-paragraph.png" />
          </Segment>
        ) : null}

        <h1>Result</h1>
        <List divided verticalAlign="middle">
          {toDoItems.map((todo, index) => (
            <List.Item key={index}>
              <List.Content floated="right">
                <Button onClick={() => removeTodo(index)}>Delete</Button>
              </List.Content>
              <List.Content
                verticalAlign="middle"
                style={{ paddingTop: 5, fontSize: 20 }}
              >
                {todo.name}
              </List.Content>
            </List.Item>
            //   <li key={todo.id}>{todo.name}</li>
          ))}
        </List>
        {textMemory ? (
          <div>
            <h2>{savedText}</h2>
            {/* <button onClick={() => removeTodo(index)}>x</button> */}
          </div>
        ) : null}
        {/* <div>
          <Card.Group>{this.state.tasklist}</Card.Group>
        </div> */}
      </div>
    </>
  );
}
