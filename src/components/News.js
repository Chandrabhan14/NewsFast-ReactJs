import React, { useEffect,useState } from "react";
import Newsitem from "./Newsitem";
import Spinner from "../Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News=(props)=> {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page,setPage] = useState(1)
    const [totalResults, setTotalResults] = useState(0)
  

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  

  const updateNews = async ()=> {
    props.setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
 
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    //parsed data converts json data into js
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    // console.log(parsedData);
    
    props.setProgress(100);
  }
  useEffect(() => {
      document.title = `${capitalizeFirstLetter(
        props.category 
      )} - NewsFast`;
    updateNews();
  }, [])
  

  const fetchMoreData = async ()=>{
    // state({page: state.page +1})
    setPage(page+1)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    // setState({ loading: true });
    let data = await fetch(url);
    //parsed data converts json data into js
    let parsedData = await data.json();
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)

  };

     
    return (
      <>
        <h1 className="text-center" style={{ margin: "35px 0px" , marginTop: '90px' }}>
          NewsFast - Top {capitalizeFirstLetter(props.category)}{" "}
          Headlines
        </h1>
        {loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="conatiner">
            <div className="row">
              {articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                  <Newsitem
                    title={element.title ? element.title.slice(0, 45) : ""}
                    description={
                      element.description
                        ? element.description.slice(0, 88)
                        : ""
                    }
                    imageUrl={element.urlToImage}
                    newsUrl={element.url}
                    author={element.author}
                    date={element.publishedAt}
                    source={element.source.name}
                  />
                </div>;
              })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  
}

News.defaultProps = {
    country: "in",
    pageSize: 8,
    category: "general",
  };
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

export default News;



