
import React, { useEffect, useState } from "react";
import { Container, Image, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import BlogAuthor from "../../components/blog/blog-author/BlogAuthor";
import BlogLike from "../../components/likes/BlogLike";
import posts from "../../data/posts.json";
import "./styles.css";

const Blog = props => {
  const [blog, setBlog] = useState({});
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("token")
  const params = useParams();
  const navigate = useNavigate();

    const {id} = params


  useEffect(() => {
    const url = "https://striveblog-s75e.onrender.com/blogPosts/"

    const getBlog = async()=>{
      try {
        const res = await fetch(`${url}${id}`, {
          headers: {
            Authorization: token
          }
        })

      if (res.ok) {
        const json = await res.json()
        setBlog(json)

        setLoading(false);

      } else {
        navigate("/404");
      }


      } catch (error) {
        console.log(error)
      }

    }
    getBlog()

  }, [params]);

  if (loading) {
    return <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status" size="md">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
  } else {
    return (
      <div className="blog-details-root">
        <Container>
          <Image className="blog-details-cover" src={blog.cover} fluid />
          <h1 className="blog-details-title">{blog.title}</h1>

          <div className="blog-details-container">
            <div className="blog-details-author">
              <BlogAuthor {...blog.author} />
            </div>
            
            <div className="blog-details-info">
{              /*<div>{blog.createdAt}</div>
              <div>{`lettura da ${blog.readTime.value} ${blog.readTime.unit}`}</div>*/}
              <div
                style={{
                  marginTop: 20,
                }}
              >
                <BlogLike defaultLikes={["123"]} onChange={console.log} />
              </div>
            </div>
          </div>

          <div
            dangerouslySetInnerHTML={{
              __html: blog.content,
            }}
          ></div>
        </Container>
      </div>
    );
  }
};

export default Blog;
