var getFeed = [
    {
        "id": 0,
        "name": "Kukiatwdasss",
        "topic": "Test Topic",
        "rating": "7.0/10",
        "description": "A quick note that rather than having to rebase your own master branch to ensure you are starting with clean state, you should probably work on a separate branch and make a pull request from that. This keeps your master clean for any future merges and it stops you from having to rewrite history with -f which messes up everyone that could have cloned your version",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 1,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 1",
        "rating": "7.0/10",
        "description": "As your fork only exists on github, and github does not have tools for doing merges through the web interface, then the right answer is to do the upstream merge locally and push the changes back to your fork",
        "imageName": "https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/01/06/09/saddam-hussein.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 2,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 2",
        "rating": "7.0/10",
        "description": "If you don't want to rewrite the history of your master branch, (for example because other people may have cloned it) then you should replace the last command with",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 3,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 3",
        "rating": "7.0/10",
        "description": "This updates my local fork, but my fork on Githu43 commits behind. I had to use lobzik's technique to create a pull request for myself to merge the master changes i",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 4,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 4",
        "rating": "7.0/10",
        "description": "",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 5,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 5",
        "rating": "7.0/10",
        "description": "Where do you enter these commands, though? The gist of the question, as I understand it, is how to resynchronize your personal GitHub fork with the main project, and do this all from GitHub. In ",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 6,
        "name": "Test Topic 6",
        "topic": "kuy rai sasssss",
        "rating": "7.0/10",
        "description": "Assuming you never committed anything on master yourself you should be done already. Now you can push your local master to your origin remote GitHub fork. You could also rebase your development branch on your now up-to-date local master",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 7,
        "name": "Test Topic 6",
        "topic": "kuy rai sasssss",
        "rating": "7.0/10",
        "description": "Assuming you never committed anything on master yourself you should be done already. Now you can push your local master to your origin remote GitHub fork. You could also rebase your development branch on your now up-to-date local master",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
    {
        "id": 8,
        "name": "Kukiatwdasss",
        "topic": "Test Topic 8",
        "rating": "7.0/10",
        "description": "",
        "imageName": "https://harvardgazette.files.wordpress.com/2017/03/mark-zuckerberg-headshot-11.jpg",
        "imageBook": "https://images-na.ssl-images-amazon.com/images/I/71Ui-NwYUmL.jpg"

    },
]

exports.findFeed = function(id) {
    for (var i = 0; i < getFeed.length; i++) {
        if (getFeed[i].id == id) 
            return getFeed[i];
    }
}