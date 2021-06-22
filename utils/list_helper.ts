import {Blog} from "../models/blog"


function dummy(blogs: (typeof Blog | any)[]) {
    return 1
}

function totalLikes(blogs: (typeof Blog | any)[]): number {
    return blogs.reduce((sum, item) => sum + item.likes, 0)
}

function favouriteBlogs(blogs: (typeof Blog | any)[]) {
    let favouriteBlog = blogs[0]
    for (let i = 1; i < blogs.length; i++) {
        if (blogs[i].likes > favouriteBlog.likes) {
            favouriteBlog = blogs[i]
        }
    }
    return favouriteBlog
}

module.exports = {dummy, totalLikes, favouriteBlogs}