const Discord = require('discord.js');
const client = new Discord.Client();
const emailExistence = require('email-existence');
const dateFormat = require('dateformat');
const swearjar = require('swearjar');
const secret = require('./secret')

let unverifiedMembers = {}

// const server = 

client.on('guildMemberAdd', member => {
    // let role = member.guild.roles.cache.find(role => role.name === "unverified")
    // member.roles.add(role);

    // member.guild.channels.cache.find(channel => channel.name === "🔎verification").send(`Welcome to the Novi Discord Server, ${member}! Verify yourself to gain access to the rest of the server like this:`);
    // member.guild.channels.cache.find(channel => channel.name === "🔎verification").send('Name: Sanjith Udupa\n' +
    // 'Email: novudupas49@stu.novik12.org\n' +
    // 'Grade: 9\n' +
    // 'Birthday: November 27');

    newUser(member)

});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    let logonEmbed = new Discord.MessageEmbed()
        .setColor("#1eb423")
        .setTitle("Bot is now online!")
        .setImage('https://cdn.discordapp.com/icons/725185204477493268/a_f10a420303ab39c6b1aaf4c1dfb01a2b.webp?size=256')
        .setFooter('made for No.Vi by sanjithar#9679 and Spes#0845', 'https://cdn.discordapp.com/icons/725185204477493268/a_f10a420303ab39c6b1aaf4c1dfb01a2b.webp?size=256');

    let server = client.guilds.cache.get("725185204477493268")
    let botSpam = server.channels.cache.find(channel => channel.name === "🤖bot-spam")

    botSpam.send(logonEmbed)


});
  
client.on('message', msg => {
    if(msg.author.bot == false){
        processMessage(msg)
    }
});

client.on('disconnect', () => {
    console.log(`Logged off`);
    let logoffEmbed = new Discord.MessageEmbed()
        .setColor("#c72d0e")
        .setTitle("Bot is now going offline")
        .setImage('https://cdn.discordapp.com/icons/725185204477493268/a_f10a420303ab39c6b1aaf4c1dfb01a2b.webp?size=256')
        .setFooter('made for No.Vi by sanjithar#9679 and Spes#0845', 'https://cdn.discordapp.com/icons/725185204477493268/a_f10a420303ab39c6b1aaf4c1dfb01a2b.webp?size=256');
    //732432823205494898 = test server
    let server = client.guilds.cache.get("725185204477493268")
    let botSpam = server.channels.cache.find(channel => channel.name === "🤖bot-spam")

    botSpam.send(logoffEmbed)
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function newUser(member){
    // let role = member.guild.roles.cache.find(role => role.name === "unverified")
    // member.roles.add(role);

    member/*.guild.channels.cache.find(channel => channel.name === "🔎verification")*/.send(`Welcome to the Novi Discord Server, ${member}! Verify yourself to gain access to the rest of the server like this:`);
    member/*.guild.channels.cache.find(channel => channel.name === "🔎verification")*/.send('Name: First Last\n' +
    'Email: YOUR_SCHOOL_EMAIL\n' +
    'Grade: 9 (10,11,12, alumni)\n' +
    'Birthday: November 27 (optional)');
}

async function processMessage(msg){
    // console.log(client.guilds.cache.get("732432823205494898").members.cache.get(msg.author.id).roles.cache.find(r => r.name === "unverified"))
    let server = client.guilds.cache.get("725185204477493268")
    let serverMember = server.members.cache.get(msg.author.id)
    let verificationLog = server.channels.cache.find(channel => channel.name === "log")
   
    if(msg.channel.type == "dm"){
        if(serverMember.roles.cache.find(r => r.name === "unverified")){
            let text = msg.content

            verificationLog.send(`From ${msg.author}, \n` + text)
    
    
            if(!(text.toLowerCase().includes("name") || text.toLowerCase().includes("email") || text.toLowerCase().includes("grade")|| text.toLowerCase().includes("birthday"))){
                return
            }
    
            // const calls = {"name": setName, "grade": setGrade, "birthday": setBirthday}
    
            let inputs = text.toLowerCase().split("\n")
    
            let verified = []
    
            if(!(msg.author.id in unverifiedMembers)){
                verified = [null, null, null]
            }else{
                verified = unverifiedMembers[msg.author.id]
            }
    
            for(var input in inputs){
                let list = inputs[input].split(":")
                switch(list[0]){
                    case "name" : {
                        verified[0] = setName(msg, list[1].trim(), serverMember)
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
                        verified[1] = setGrade(list[1].trim(), serverMember, server)
                        break
                    }
                    case "birthday" : {
                        // msg.channel.send("set birthday to " + list[1].trim())
                        setBirthday(msg, list[1].trim(), server)
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
    
            unverifiedMembers[msg.author.id] = verified
    
            if(!verified.includes(null)){
                msg.reply("You are now verified! Visit <#725185204477493271> to start talking with other Novi people!")
                
                delete unverifiedMembers[msg.author.id]
                // let verification = server.channels.cache.find(channel => channel.name === "🔎verification")
                // verification.messages.fetch({limit: 50}).then(m => {
                //     let filtered = m.filter(message => message.author === msg.author) 
                //     verification.bulkDelete(filtered).then(messages => console.log(`bulkdeleted ${messages.size} messages from ${msg.author}`)).catch(console.error)
                    
                // })
        
                // await sleep(2000)
                // console.log(msg.author)
                console.log(verified[0])
    
                serverMember.setNickname(verified[0])
                if(serverMember.nickname == verified[0]){
                    serverMember.roles.add(verified[1])
                    serverMember.roles.remove(server.roles.cache.find(role => role.name === "unverified"))
                }else{
                    msg.reply("Something went wrong, please try again")
                }

               
            }else{
                msg.reply("Unable to fully verify! Please list the following pieces of info:")
                for(var i in verified){
                    // console.log(verified[i] == null)
                    if(verified[i] == null){
                        if(i == 0){
                            msg.reply("Name")
                        }
                        if(i == 1){
                            msg.reply("Grade")
                        }
                        if(i == 2){
                            msg.reply("Email")
                        }
                    }
                }
                
            }
        }else{
            msg.reply("You are already verified")
        }

    }else if(msg.content.toLowerCase().substring(0,8) == "nickname"){
        if(serverMember.nickname != null){
            let nickname = msg.content.toLowerCase().substring(8).trim()
            if(!swearjar.profane(nickname)){
                if(nickname == ""){
                    let og = serverMember.nickname.split(" |")[0]
                    serverMember.setNickname(og)
                    msg.channel.send("Your nickname has been reset back to " + og)
                }else{
                    let newName = serverMember.nickname.split(" |")[0] + " | " + nickname
                    serverMember.setNickname(newName)
                    msg.channel.send("Your nickname has been set to " + newName)
                }
            }else{
                msg.reply(" bruh this is a school server, keep it clean")
            }
        }else{
            msg.channel.send("Only verified members can change nicknames")
        }
    }
}

function setName(msg, name, serverMember){
    let names = name.split(" ")
    if(names.length < 2){
        msg.channel.send("please include your first and last name")
        return null
    }else {
        let newName = names[0].charAt(0).toUpperCase() + names[0].slice(1) + " " + names[1].charAt(0).toUpperCase()
        // msg.channel.send("set name to " + newName)

        // serverMember.setNickname(newName)
        return newName
    }
}

function setGrade(grade, serverMember, server){
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
        return null
    }
    let role = server.roles.cache.find(role => role.name === roleName);
    // serverMember.roles.add(role)

    return role
}

function setBirthday(msg, birthday, server){
    // commands channel = 734062100154155080
    let date = dateFormat(birthday, "mmm dd").replace(" ", "-").toLowerCase()
    server.channels.cache.find(channel => channel.name === "sticky-notes").send("bb.override " + msg.author.id + " bb.set " + date);
    // msg.reply("please format your birthday in a standard format or omit it entirely")
}


//novi bot

//https://discord.com/oauth2/authorize?client_id=734056419569172511&scope=bot
//https://discord.com/api/oauth2/authorize?client_id=734056419569172511&permissions=1556343926&scope=bot
client.login(secret.token);