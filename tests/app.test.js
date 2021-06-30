let expect = require('chai').expect;
let request = require('request');

// Group of tests that will check the insurance route and its modules' working
describe('Status and content', function () {
    describe('Insurance page', function () {

        // Test to check if the correct status (200) is returned when using the route
        it('status', function (done) {
            request('http://localhost:8000/?q=akaxd123',
                function (error, response) {
                    expect(response.statusCode).to.equal(200);
                    done();
                });
        });

        // Test to check if the route returns a correct response when queried for an existing user
        it('correct parameters', function (done) {
            request('http://localhost:8000/?q=akaxd123',
                function (error, response) {
                    expect(response).to.equal([
                        [
                            {
                                "username": "",
                                "avatar": "https://avatars.githubusercontent.com/u/8563697?v=4",
                                "bio": "",
                                "userpage": "https://github.com/akaxd123",
                                "repolink": "https://api.github.com/users/akaxd123/repos",
                                "vcs": "github"
                            },
                            [
                                {
                                    "repoName": "g",
                                    "repoDescription": "gg",
                                    "creationDate": "2015-01-14T01:05:12Z",
                                    "lastCommitDate": "2015-01-14T01:05:12Z",
                                    "commitDescriptions": []
                                }
                            ]
                        ],
                        [],
                        [
                            {
                                "username": "Antony Kwok",
                                "avatar": "https://bitbucket.org/account/akaxd123/avatar/",
                                "bio": "",
                                "userpage": "https://bitbucket.org/%7B85052312-b62e-4013-9889-2ad05cb40cfa%7D/",
                                "repolink": "https://api.bitbucket.org/2.0/repositories/%7B85052312-b62e-4013-9889-2ad05cb40cfa%7D",
                                "vcs": "bitbucket"
                            },
                            [
                                {
                                    "repoName": "219 HW 2 Hangman",
                                    "repoDescription": "219 HW 2 Hangman",
                                    "creationDate": "2014-09-08T05:49:52.329303+00:00",
                                    "lastCommitDate": "2015-03-19T06:48:02.099623+00:00",
                                    "commitDescriptions": [
                                        "Finished adding french language",
                                        "File",
                                        "File",
                                        "Added French language",
                                        "added JavaDoc"
                                    ]
                                },
                                {
                                    "repoName": "219 HW 2",
                                    "repoDescription": "",
                                    "creationDate": "2014-09-10T13:54:48.980425+00:00",
                                    "lastCommitDate": "2015-03-19T06:38:50.321334+00:00",
                                    "commitDescriptions": [
                                        "DONE",
                                        "added switch frames, good size, changed lang buttons",
                                        "Changed to changeworkspace method",
                                        "Changed to changeworkspace method",
                                        "Finished adding french language\\nConflicts:\\n\\t219 HW 2/Hangman_draft/data/FR_FiveLetterWordsList.txt\\n\\t219 HW 2/Hangman_draft/data/FR_ListeCinqLetterWords.txt\\n\\tdata/FR.xml\\n\\tdata/FR_ListeCinqLetterWords.txt\\n"
                                    ]
                                },
                                {
                                    "repoName": "219 HW 3 SOkoban",
                                    "repoDescription": "",
                                    "creationDate": "2014-10-10T19:19:10.906172+00:00",
                                    "lastCommitDate": "2015-03-19T06:45:20.028430+00:00",
                                    "commitDescriptions": [
                                        "Added a little funny transition animation figure",
                                        "Have mouseclick and dragged(pressed and released)",
                                        "Finished game logic movements (hopefully) and sounds",
                                        "added timerenderer + saving + loading",
                                        "added all sounds"
                                    ]
                                },
                                {
                                    "repoName": "219 Journey Through Europe",
                                    "repoDescription": "",
                                    "creationDate": "2014-11-02T00:21:35.414910+00:00",
                                    "lastCommitDate": "2015-03-19T06:41:14.259091+00:00",
                                    "commitDescriptions": [
                                        "Added new colors",
                                        "Added new colors",
                                        "finished HW5",
                                        "SplashButton now good\\nAdded colors and stuff to GUI\\ncommented out coordinates of other maps",
                                        "Got coordinates working, reading in from cvs\\nGot SplashButton working"
                                    ]
                                }
                            ]
                        ]
                    ]);
                    done();
                });
        });

        // Test to check if the module returns a correct response when the queried for a non-existing user or an error occurs
        it('correct parameters', function (done) {
            request('http://localhost:8000/?q=IdontReallyExist1235',
                function (error, response) {
                    expect(response).to.equal([
                        [],
                        [],
                        []
                    ]);
                    done();
                });
        });
    });
});