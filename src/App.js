import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios'

function App() {

  const [searchText, setSearchText] = useState('')
  const [imageData, setImageData] = useState([])
  const [bookmarks, setBookmarks] = useState([])
  const [searchClicked, setSearchClicked] = useState(false)
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (searchText === '' || !searchClicked) return

    const params = {
      method: "flickr.photos.search",
      api_key: "8a31b450ccdedd68f55bd97fb4f40020",
      text: searchText,
      license: "4",
      sort: "",
      per_page: 40,
      format: "json",
      nojsoncallback: 1
    }
    const parameters = new URLSearchParams(params)
    const url = `https://api.flickr.com/services/rest/?${parameters}`

    axios.get(url)
      .then((res) => {
        const arr = res.data.photos.photo.map((imgData) => {
          return {
            imageUrl: fetchFlickrImageUrl(imgData),
            isBookmarked: false
          }
        })
        setImageData(arr)
        console.log(arr);
      }).catch((err) => {
        console.log(err);
      })
  }, [searchText, searchClicked])

  const fetchFlickrImageUrl = (photo, size) => {
    let url = `https://farm${photo.farm}.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}`
    if (size) {
      url += `_${size}`
    }
    url += `.jpg`
    return url
  }

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }
  const handleSearchClicked = () => {
    setSearchClicked(true)
  }
  const handleBookmark = (index) => {
    const newBookmarks = [...bookmarks]
    newBookmarks.push(imageData[index])
    setBookmarks(newBookmarks)

    const newImageData = [...imageData]
    newImageData[index].isBookmarked = true
    setImageData(newImageData)
  }

  return (
    <div className="App">
      <div className='header'>
        <h1>React Photo Search</h1>
        <h2>Bookmarks</h2>

        <div className="bookmark">
          {
            bookmarks.length > 0 ?
              <div className="bookmark-container">
                {
                  bookmarks.map((image, index) => {
                    return (
                      <>
                        <img src={image.imageUrl} alt="bookmark image" className='bookmark-image' />
                      </>
                    )
                  })
                }
              </div>
              :
              ""
          }
        </div>
      </div>


      <div className="container">
        <input
          onChange={handleSearchTextChange}
          value={searchText}
          type="text"
          placeholder='search free high resolution images'
        />
        <button
          onClick={handleSearchClicked}
        >Search</button>
      </div>

      <section className="image">
        {
          searchClicked && imageData.length > 0 ?
            <div className="image">
              {
                imageData.map((image, index) => {
                  return (
                    <div>
                      <img
                        src={image.imageUrl}
                        alt="img" className='images'
                        onMouseOver={() => setHover(true)}
                        onMouseleave={() => hover === index && setHover(null)}
                      />
                      {
                        hover &&
                        <img src='https://static.vecteezy.com/system/resources/thumbnails/005/200/965/small/bookmark-black-color-icon-vector.jpg'
                          onClick={() => { handleBookmark(index) }}
                          className='bookmark-icon' />
                      }
                    </div>
                  )
                })
              }
            </div>
            :
            <p>{""}</p>
        }
      </section>


    </div>
  );
}

export default App;


// key - 8a31b450ccdedd68f55bd97fb4f40020
// secret  - 4cd0f69744081cf0


/**
 testcases
 1 - done
 2 - done
 3 - done
 4 - done
 */

