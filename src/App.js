import React, {Component} from 'react'
import {Hits, LayoutBody, LayoutResults, NoHits, SearchBox, SearchkitManager, SearchkitProvider} from 'searchkit'
import './index.css'
import dotenv from 'dotenv'

dotenv.config();

const host = process.env.REACT_APP_SEARCHLY_URL;
const auth = process.env.REACT_APP_SEARCHLY_API;

const sk = new SearchkitManager(host,{
    basicAuth: auth, // API KEY
    searchOnLoad: false
});



class MovieHitsTable extends React.Component {

    render(){
        const { hits } = this.props;
        return (
            <div className="Rtable-container">
                  {hits.map(hit => {
                      return (
                          <div className="Rtable Rtable--3cols Rtable--collapse">
                        <div className="Rtable-cell Rtable-cell--head">{hit._source.studentname}</div>
                          <div className="Rtable-cell">{hit._source.degreename}</div>
                       <div className="Rtable-cell Rtable-cell--alignMiddle Rtable-cell--alignCenter">{hit._source.degreemonth}&nbsp;{hit._source.degreeyear}</div>
                          </div>
                )})}
            </div>
        )
    }
}

// test

// class MovieHits extends Hits {
//     renderResult(result:any) {
//         return (
//             <div className={this.bemBlocks.item().mix(this.bemBlocks.container("item"))} key={result._id}>
//               <img className={this.bemBlocks.item("degreename")}/>
//               <div className={this.bemBlocks.item("degreename")} dangerouslySetInnerHTML={{__html:_.get(result,"highlight.degreename",false) || result._source.degreename}}></div>
//             </div>
//         )
//     }
// }


class App extends Component {
    render(){
        let queryOpts = {
            analyzer:"standard"
        };
        return (
            <SearchkitProvider searchkit={sk}>
              <div className="search1">
                    <h2>Palmarès de l'Université de Genève (dès 1999)</h2>
                  <SearchBox
                             translations={{"searchbox.placeholder":"Doe John", "NoHits.DidYouMean":"Search for {suggestion}."}}
                             queryOptions={queryOpts}
                              autofocus={true}
                              searchOnChange={true}
                              prefixQueryFields ={["studentname"]}/>
                <LayoutBody>
                <LayoutResults>
                <div className="_Search_display_wrapper">
                  {/*<div className="search__results">*/}
                      {/* search results */}

                      <Hits listComponent={MovieHitsTable}
                            hitsPerPage={10}
                            sourceFilter={["studentname", "degreename", "degreemonth", "degreeyear"]}/>
                      {/* if there are no results */}
                    <NoHits className="sk-hits" translations={{
                        "NoHits.NoResultsFound":"No results were found for {query}",
                        "NoHits.DidYouMean":"Search for {suggestion}"
                    }} suggestionsField="studentname"/>
                  {/*</div>*/}
                </div>
                </LayoutResults>
                </LayoutBody>
              </div>
            </SearchkitProvider>
        )
    }
}

export default App;
