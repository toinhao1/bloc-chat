import React, { Component } from 'react';



class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms:[],
      newName: ''
    };
    this.roomsRef = this.props.firebase.database().ref('rooms');
  }
  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
      if (this.state.rooms.length === 1) {this.props.setActiveRoom(room)}
    });
  }

  handleChange(e) {
    this.setState({ newName: e.target.value });
  }
  createRoom(newName) {
    this.roomsRef.push({
      name: newName,
      createdAt: Date.now(),
      });
      this.setState({ newName: ' '});
    }
  handleSubmit(e) {
    e.preventDefault();
    this.createRoom(this.state.newName);
  }
  deleteRoom(currentRoom) {
    const filteredRooms = this.state.rooms.filter(function(e) {
      return e.key !== currentRoom;
    });
    this.setState({ rooms: filteredRooms});
    this.roomsRef.child(currentRoom).remove()
  }
  componentWillUnmount(currentRoom) {
    this.roomsRef.off('child_added', (snapshot) => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat(room) });
    });
  }

  render() {
    return (
      <section>
        <div className="room-list">
          {this.state.rooms.map( ( room, index ) =>
            <div key={room.key} onClick={() => this.props.setActiveRoom(room)}>{room.name}
            <button className="del-button" onClick={(e) => { if (window.confirm('Are you sure you wish to delete this room?')) this.deleteRoom(room.key)}}>Delete</button>
            </div>
            )
          }
        </div>
        <form className="newChatRoom" onSubmit={(e) => {this.handleSubmit(e)}}>
          <label>
            <input type="text" placeholder="Create a new room..."  value={this.state.newName} onChange={this.handleChange.bind(this)} />
          </label>
          <input type="submit" value="New Room" />
        </form>
      </section>
    )
  }
}
export default RoomList;
