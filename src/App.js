import React from 'react';
import Particles from 'react-particles-js';
import './App.css';

import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceDetection from './components/FaceDetection/FaceDetection';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';


const particlesOptions = {
  particles: {
    number:{
      value: 100,
      density: {
        enable: true,
        value_area : 800
      }
    }
  }
};

let initialState = {
  input:'',
  imgURL:'',
  box: {},
  route: 'signin',
  isSignedIn : false,
  user: {
      id: '',
      name: '',
      email:'',
      entries: 0,
      joined: ''
  }

};

class App extends React.Component {

  constructor() {
    super();
    this.state = initialState;
  }

  loadUser = (userData) => {
    this.setState({
      user : {
        id: userData.id,
        name: userData.name,
        email:userData.email,
        entries: userData.entries,
        joined: userData.joined
      }
    })
    console.log("state.user:",this.state.user);
  }

  calcFaceLocation = (data) => {
        const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById('inputimage');
        const width = Number(image.width);
        const height = Number(image.height);
        return {
          leftCol : clarifaiFace.left_col * width,
          topRow : clarifaiFace.top_row * height,
          rightCol : width - (clarifaiFace.right_col * width),
          bottomRow : height - (clarifaiFace.bottom_row * height)
        }
  }

  displayFaceBox = (box) => {
    this.setState({box: box });
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onSubmit = () => {
    this.setState({
      imgURL : this.state.input,
    });
    fetch("http://localhost:3001/imageurl",{
              method : 'post',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify({
                  input : this.state.input
              })
      })
      .then(resp=> resp.json())
      .then(resp => {
        if(resp){
          fetch("http://localhost:3001/image",{
              method : 'put',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify({
                  id : this.state.user.id
              })
            })
            .then(res=> res.json())
            .then(count =>{
                this.setState(Object.assign(this.state.user, {entries: count}))
              })
        };
        console.log(this.state.user.id);
        this.displayFaceBox(this.calcFaceLocation(resp));
      }).catch(err => console.log(err) );
  }

  onRouteChange = (route) => {
    if (route==='signout'){
      this.setState(initialState);
    } else if (route==='home'){
    this.setState({isSignedIn:true})
    }
    this.setState({route: route});
  }

  render(){

    const {isSignedIn, imgURL, route, box, user} = this.state;

    return (
      <div className="App">
      
        <Particles className="particles"
          params={particlesOptions} />
        <Navigation isSignedIn={isSignedIn}  onRouteChange={this.onRouteChange}></Navigation>
        { route === 'home' 
          ? <div>
              
              <Logo></Logo>
              <Rank name={user.name} entries={user.entries} ></Rank>
              <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onSubmit}></ImageLinkForm>
              <FaceDetection box={box} imgURL = {imgURL} ></FaceDetection>
            </div>
          : (
              this.state.route === 'signin'
              ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser}></SignIn>
              : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}></Register>
          )
        }
      </div>
    );
  }

  // componentDidMount(){
  //   fetch('http://localhost:3001/')
  //   .then(res => res.json())
  //   .then(console.log);
  // }

}

export default App;
