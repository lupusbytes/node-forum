const knexConfig = require('../knexfile');
const Knex = require('knex');
const knex = Knex(knexConfig.development);


function insertUsers() {
    return knex('users').insert(
        [
            {
                username: "John",
                email: "john@test.dk",
                password: "$2b$10$toWoigMb9ZpLRprbsUHjk.oWNHpmOCUmg0daiYKXseuG/G2pWPuQO"
            },
            {
                username: "Skurken",
                email: "skurk@test.dk",
                password: "$2b$10$toWoigMb9ZpLRprbsUHjk.oWNHpmOCUmg0daiYKXseuG/G2pWPuQO"
            },
            {
                username: "D0m1n470r",
                email: "dom@test.dk",
                password: "$2b$10$toWoigMb9ZpLRprbsUHjk.oWNHpmOCUmg0daiYKXseuG/G2pWPuQO"
            },
            {
                username: "Lars Larsen",
                email: "ll@jysk.dk",
                password: "$2b$10$toWoigMb9ZpLRprbsUHjk.oWNHpmOCUmg0daiYKXseuG/G2pWPuQO"
            }
        ]
    );
}
function insertCategories() {
    return knex('categories').insert(
        [
            {
                name: "Generelt"
            },
            {
                name: "Sjov / Jokes"
            },
            {
                name: "Computerspil"
            }
        ]
    );
}

function selectCategories() {
    return knex('categories');
}
function selectUsers() {
    return knex('users');
}
function selectThreads() {
    return knex('threads');
}

function insertThreads(categories, users) {
    return knex('threads').insert(
        [
            {
                category_id: (categories.find(o => o.name === 'Generelt')).id,
                created_by: (users.find(o => o.username === 'Skurken')).id,
                name: "Hvilken film så du sidst - og var den god ?"
            },
            {
                category_id: (categories.find(o => o.name === 'Generelt')).id,
                created_by: (users.find(o => o.username === 'Lars Larsen')).id,
                name: "Elsker i også dyner ?"
            },
            {
                category_id: (categories.find(o => o.name === 'Sjov / Jokes')).id,
                created_by: (users.find(o => o.username === 'Lars Larsen')).id,
                name: "Homofobi"
            },
            {
                category_id: (categories.find(o => o.name === 'Sjov / Jokes')).id,
                created_by: (users.find(o => o.username === 'D0m1n470r')).id,
                name: "Chuck Norris FACTS!"
            },
            {
                category_id: (categories.find(o => o.name === 'Computerspil')).id,
                created_by: (users.find(o => o.username === 'D0m1n470r')).id,
                name: "Nogle der vil spille Counter-strike med mig ? :("
            }
        ]
    )
};

function insertPosts(threads, users) {
    return knex('posts').insert(
        [
            {
                thread_id: (threads.find(o => o.name === 'Hvilken film så du sidst - og var den god ?')).id,
                created_by: (users.find(o => o.username === 'Skurken')).id,
                content: `Tænkte en tråd som denne kunne være useful som inspirationskilde til hvad man skal smække op på skærmen en dag hvor den står på film tid. IMDB ratings kan man ikke altid regne med imo.
For at tråden bliver brugbar så bør en posts indeholde:

1. Filmtitle evt link
2.  Hvor god er filmen fra 1 - 10. (hvor 10 er bedst)
3. Dine kommentar til filmen og hvorfor du gav den top eller bund karakter.`
            },
            {
                thread_id: (threads.find(o => o.name === 'Hvilken film så du sidst - og var den god ?')).id,
                created_by: (users.find(o => o.username === 'John')).id,
                content: "Har lige set fars fede juleferie, den var fandme sjov :DDDD"
            },
            {
                thread_id: (threads.find(o => o.name === 'Hvilken film så du sidst - og var den god ?')).id,
                created_by: (users.find(o => o.username === 'D0m1n470r')).id,
                content: "Jeg så lige I Kina Spiser de Hunde. 10/10"
            },
            {
                thread_id: (threads.find(o => o.name === 'Elsker i også dyner ?')).id,
                created_by: (users.find(o => o.username === 'Lars Larsen')).id,
                content: "Mit navn er Lars Larsen og jeg elsker dyner."
            },
            {
                thread_id: (threads.find(o => o.name === 'Homofobi')).id,
                created_by: (users.find(o => o.username === 'Lars Larsen')).id,
                content: `To mænd i den australske ørken.
                        Den ene går om bag en kaktus for at tisse, HAPS, han bliver bidt i tisseren af en giftig slange.
                        – Hjælp, råbte han til vennen, der straks ringede til de flyvende læger.
                        – Hvad skal jeg gøre? min ven er blevet bidt af en giftig slange!
                        – Du er nød til at suge giften ud ellers dør han om 5 min!
                        Han lagde røret.
                        – Hvad sagde de, hvad sagde de? råbte vennen desperat.
                        – Du dør om 5 min! 
                        `
            },
            {
                thread_id: (threads.find(o => o.name === 'Homofobi')).id,
                created_by: (users.find(o => o.username === 'John')).id,
                content: "Hahahaha det er sjovt fordi han ikke vil sutte tissemand"
            },
            {
                thread_id: (threads.find(o => o.name === 'Chuck Norris FACTS!')).id,
                created_by: (users.find(o => o.username === 'D0m1n470r')).id,
                content: `Jeg starter.

                        Chuck Norris sover med en nat lampe tændt –
                        ikke fordi han er bange for mørke –
                        men fordi mørket er bange for ham. `
            },
            {
                thread_id: (threads.find(o => o.name === 'Nogle der vil spille Counter-strike med mig ? :(')).id,
                created_by: (users.find(o => o.username === 'D0m1n470r')).id,
                content: "jeg har ikke nogen at spille med, jeg er silver elite, add mig på steam"
            }
        ]
    )
}

insertUsers()
    .then(() => {
        insertCategories()
            .then(() => {
                selectUsers()
                    .then(users => {
                        selectCategories()
                            .then(categories => {
                                insertThreads(categories, users)
                                    .then(() => {
                                        selectThreads()
                                            .then(threads => {
                                                insertPosts(threads, users)
                                                    .then(() => {
                                                        process.exit();
                                                    });
                                            });
                                    });
                            });
                    });
            });
    });
