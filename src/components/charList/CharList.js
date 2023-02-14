import MarvelService from '../../services/MarvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

import './charList.scss';
import { Component } from 'react';

class CharList extends Component{
    
           state = {
            charList: [],
            loading: true,
            error: false,
            newItemLoading: false,
            offset: 210,
            charEnded: false
        }
    marvelService = new MarvelService();

    componentDidMount(){
        this.onRequest();
    }
    onRequest = (offset) => {
        this.onCharListLoading();

        // запит на сервер - запис в функцію onCharListLoaded
        this.marvelService
        .getAllCharacters(offset)
        .then(this.onCharListLoaded)
        .catch(this.onError)
    }
    onCharListLoading = () => {
        this.setState({newItemLoading:true})
    }
    onCharListLoaded = (newCharList) => {
        // якщо чари закінчилися , то кнопка с загрузкою по 9 чарів зникає.
        let ended = false;
        if (newCharList.length < 9) {
            ended = true;
        }
        // доповнюю старий масив - новим з чарами 
        this.setState(({offset, charList}) => ({
            charList: [...charList, ...newCharList],
            loading: false,
            newItemLoading: false,
            offset: offset + 9,
            charEnded: ended
        }))
    }
    onError = () => {
         this.setState({error:true,loading:false})
    }
    itemsRef = [];

    setRef = (ref) => {
        this.itemsRef.push(ref);
    }

    onFocusChar = (id) => {
        this.itemsRef.forEach((item) => item.classList.remove('char__item_selected'))
        this.itemsRef[id].classList.add('char__item_selected')
        this.itemsRef[id].focus();
    }
    renderItems(arr) {
        const items = arr.map((item,i) => {
            
            let imgStyle = {'objectFit' : 'cover'};
            // корегування фото - якщо немає фото персонажа
            if (item.thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
                imgStyle = {'objectFit' : 'unset'};
            }
            return  (<li className="char__item" 
                         key={item.id}
                         ref={this.setRef}
                         onClick={()=> {
                                this.props.onCharSelected(item.id);
                                this.onFocusChar(i)
                        }}>
                           <img src={item.thumbnail} alt="abyss" style={imgStyle}/>
                           <div className="char__name">{item.name}</div>
                    </li>
                   ) 
        })
            return ( <ul className="char__grid">
                          {items}
                    </ul>
            ); 
    }
    render(){
        const {charList, loading, error, offset, newItemLoading, charEnded} = this.state;
        const items = this.renderItems(charList);

        const errorMessage = error ? <ErrorMessage /> : null;
        const spinner = loading ? <Spinner /> : null;
        const content = !(loading || error) ? items : null;
        return (
            <div className="char__list">
                    {errorMessage}  
                    {spinner}           
                    {content}
                <button className="button button__main button__long"
                        onClick={() => this.onRequest(offset)}
                        disabled={newItemLoading} 
                        style={{'display':charEnded ? 'none' : 'block'}}>
                    <div className="inner">load more</div>
                </button>
            </div>
        )
    }
    
}
export default CharList;