const Discord = require('discord.js');
const client = new Discord.Client();
const emailExistence = require('email-existence');
const dateFormat = require('dateformat');
const secret = require('./secret')

client.on('guildMemberAdd', member => {
    let role = member.guild.roles.cache.find(role => role.name === "unverified")
    member.roles.add(role);

    member.guild.channels.cache.find(channel => channel.name === "🔎verification").send(`Welcome to the Novi Discord Server, ${member}! Verify yourself to gain access to the rest of the server like this:`);
    member.guild.channels.cache.find(channel => channel.name === "🔎verification").send('Name: Sanjith Udupa\n' +
    'Email: novudupas49@stu.novik12.org\n' +
    'Grade: 9\n' +
    'Birthday: November 27');

});

client.on('ready', () => {
console.log(`Logged in as ${client.user.tag}!`);
});
  
client.on('message', msg => {
    processMessage(msg)
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function processMessage(msg){
    if(msg.channel.name == "🔎verification" && msg.member.roles.cache.find(r => r.name === "unverified")){
        
        console.log(msg)

        let text = msg.content

        if(!text.includes("Name")){
            return
        }

        // const calls = {"name": setName, "grade": setGrade, "birthday": setBirthday}

        let inputs = text.toLowerCase().split("\n")

        let verified = [false,false,false]

        for(var input in inputs){
            let list = inputs[input].split(":")
            switch(list[0]){
                case "name" : {
                    verified[0] = setName(msg, list[1].trim())
                    break
                }
                case "email" : {

                    emailExistence.check(list[1].trim(), function(error, response){
                        if(response === true && list[1].trim().includes("stu.novik12.org")){
                            verified[2] = true
                            // msg.channel.send("set email to " + list[1].trim())
                        }else if(response === true && !list[1].trim().includes("stu.novik12.org")){
                            msg.channel.send("please use a novi email")
                        }else{
                            msg.channel.send("sorry, that email doesn't exist")
                        }
                    });
                    
                    // for(i = 0; i < 10; i++){
                    //     if(verified[2] = true){
                    //         break
                    //     }
                    //     await sleep(200)
                    // }

                    await sleep(2000)

                    break
                }
                case "grade" : {
                    // msg.channel.send("set grade to " + list[1].trim())
                    verified[1] = setGrade(msg, list[1].trim())
                    break
                }
                case "birthday" : {
                    // msg.channel.send("set birthday to " + list[1].trim())
                    setBirthday(msg, list[1].trim())
                    break
                }
                default : {
                    break
                }
            }
            // if(list[0] in calls){
            //     calls[list[0]](list[1].trim())
            // }

        }

        if(verified[0] == true && verified[1] == true && verified[2] == true){
            msg.reply("you are now verified! Visit <#732432823641702550> to start talking with other Novi people!")
        }else{
            msg.reply("unable to verify!")
        }
        
        let verification = msg.guild.channels.cache.find(channel => channel.name === "🔎verification")
        verification.messages.fetch({limit: 50}).then(m => {
            let filtered = m.filter(message => message.author === msg.author) 
            verification.bulkDelete(filtered).then(messages => console.log(`bulkdeleted ${messages.size} messages from ${msg.author}`)).catch(console.error)
            
        })

        await sleep(2000)

        msg.member.roles.remove(msg.guild.roles.cache.find(role => role.name === "unverified"))

    }
}

function setName(msg, name){
    let names = name.split(" ")
    if(names.length < 2){
        msg.channel.send("please include your first and last name")
        return false
    }else {
        let newName = names[0].charAt(0).toUpperCase() + names[0].slice(1) + " " + names[1].charAt(0).toUpperCase()
        // msg.channel.send("set name to " + newName)
        msg.member.setNickname(newName)
        return true
    }
}

function setGrade(msg, grade){
    let roleName = "alumni"
    if(grade === "9" || grade === "freshman" || grade === "9th"){
        roleName = "freshman"
    }else if(grade === "10" || grade === "sophomore" || grade === "10th"){
        roleName = "sophomore"
    }else if(grade === "11" || grade === "junior" || grade === "11th"){
        roleName = "junior"
    }else if(grade === "12" || grade === "senior" || grade === "12th"){
        roleName = "senior"
    }else if(grade === "alum" || grade === "alumni" || grade === "graduated"){
        roleName = "alumni"
    }else{
        console.log(grade)
        return false
    }
    let role = msg.guild.roles.cache.find(role => role.name === roleName);
    msg.member.roles.add(role)

    return true
}

function setBirthday(msg, birthday){
    // commands channel = 734062100154155080
    let date = dateFormat(birthday, "mmm dd").replace(" ", "-").toLowerCase()
    msg.guild.channels.cache.find(channel => channel.name === "commands").send("bb.override " + msg.author.id + " bb.set " + date);
}


//novi bot

//https://discord.com/oauth2/authorize?client_id=734056419569172511&scope=bot
client.login(secret.token);