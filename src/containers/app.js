import React,{Component} from "react";
import SearchBar from "../components/search-bar";
import VideoList from "./video-list";
import axios from "axios";
import VideoDetail from "../components/video-detail";
import Video from "../components/video";

const URL_API = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL ="discover/movie?language=fr&sort_by=popularity.desc&include_adult=false&append_to_response=images";
const API_KEY = 'api_key=2281b03a554295d570b181f8135374c0';
const SEARCH_URL = "search/movie?language=fr";
const MOVIE_VIDEO_URL = "append_to_response=video";


class App extends Component {
    constructor(props){
        super(props);
        this.state ={movieList:{},
                     currentMovie:{}
        }
    }

    componentWillMount() {
       this.initMovies();
    }

    initMovies(){
        axios.get(`${URL_API}${POPULAR_MOVIES_URL}&${API_KEY}`).then(function(response){

            this.setState({movieList:response.data.results.slice(1,6),
                          currentMovie:response.data.results[0]},
                          function () {
                              this.applyVideoToCurrentMovie(); //permet d'etre sur que la reponse soit arrivée avant d'executer applyVideoToCurrentMovie()
                          });                                   // l'affichage de la video

        }.bind(this));
    }


    applyVideoToCurrentMovie(){

        axios.get(`${URL_API}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos&language=fr`).then(function(response){

            const youtubeKey = response.data.videos.results[0].key;
            let newCurrentMovieState = this.state.currentMovie;
            newCurrentMovieState.videoId = youtubeKey;
            this.setState({currentMovie : newCurrentMovieState});

        }.bind(this));
    }

    onClickListItem(movie){
           this.setState({currentMovie:movie},
                        function () {
                          this.applyVideoToCurrentMovie();
                          this.setRecommendation();
                        })
    }

    setRecommendation(){
        axios.get(`${URL_API}movie/${this.state.currentMovie.id}/recommendations?${API_KEY}&language=fr`).then(function(response){
            this.setState({movieList:response.data.results.slice(0,5)});
        }.bind(this));
    }

    onClickSearch(searchText){
        if(searchText) {     //on test qu'il y a un text
            axios.get(`${URL_API}${SEARCH_URL}&${API_KEY}&query=${searchText}`).then(function (response) {
                if(response.data && response.data.results[0]) {//on test qu'il y a une reponse
                    if(response.data.results[0].id != this.state.currentMovie.id){
                        this.setState({currentMovie: response.data.results[0]},() =>{
                            this.applyVideoToCurrentMovie();
                            this.setRecommendation();
                        })
                    }
                }
            }.bind(this));
        }
    }

    render(){
        const renderVideoListe =()=>{
            if(this.state.movieList.length>=5){
                return <VideoList movieList={this.state.movieList} callback={this.onClickListItem.bind(this)}/>
            }
        };
        return (
            <div>
                <div className="search_bar">
                    <SearchBar callback={this.onClickSearch.bind(this)}/>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <Video videoId={this.state.currentMovie.videoId}/>
                        <VideoDetail title={this.state.currentMovie.title} description={this.state.currentMovie.overview}/>
                    </div>
                    <div className="col-md-4">
                        {renderVideoListe()}
                    </div>
                </div>
            </div>
        )
    }
}

export default App;