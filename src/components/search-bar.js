import React,{Component} from 'react'

class SearchBar extends Component {
    constructor(props){
        super(props);
        this.state = {searchText: "",
                      placeholder:"Entrez votre film...",
                    intervalBeforeRequest:1000,
                    lockRequest:false
        }
    }

    render(){
        return(
            <div className="row">
                <div className="col-md-8 input-grou">
                    <input type="text" className="form-control input-lg" onChange={this.handleChange.bind(this)} placeholder={this.state.placeholder}/>
                    <span className="input-grou⁻btn">
                          <button className="btn btn-secondary" onClick={this.handleOnClick.bind(this)}>Go</button>
                    </span>
                </div>
            </div>
        )
    }

    handleChange(event){
        this.setState({searchText:event.target.value});
        if (!this.state.lockRequest){
            this.setState({lockRequest:true});
            setTimeout(function () {this.search()}.bind(this), this.state.intervalBeforeRequest)
                
        }
    }

    handleOnClick(){
       this.search();
    }

    search(){
        this.props.callback(this.state.searchText);//lance la recherche
        this.setState({lockRequest:false})
    }

}

export default SearchBar;