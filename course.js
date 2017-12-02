var lookupCourse = function lookupCourse(watsonDataOutput, bot, message) {
    let course = watsonDataOutput.context.action.course;
    let answer;
    switch (course) {
        case 'Cloud Computing':
            answer = 'Courses to take :  <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE281.html|CMPE 281>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE282.html|CMPE 282> & <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE289.html|CMPE 289>, More details at <https://msse.sjsu.edu/cloud-computing-and-virtualization|Cloud Computing>';
            break;
        case 'Enterprise':
            answer = 'Courses to take :  E101, E102, E103 More details at https://msse.sjsu.edu/enterprise-software-technologies';
            break;
        case 'Networking':
            answer = 'Courses to take :  N101, N102, N103 More details at https://msse.sjsu.edu/networking-software';
            break;
        case 'Data Science':
            answer = 'Courses to take :  <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE255.html|CMPE 255>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE256.html|CMPE 256>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE257.html|CMPE 257>, <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE258.html|CMPE 258> & <http://info.sjsu.edu/web-dbgen/catalog/courses/CMPE266.html|CMPE 266> More details at <http://msse.sjsu.edu/data-science|Data Science>';
            break;
        case 'Systems Engineering':
            answer = 'Courses to take :  SE101, SE102, SE103 More details at https://msse.sjsu.edu/software-systems-engineering';
            break;
        default:
            answer = 'No Specialization taken'; 
    }
    
    bot.reply(message, answer);
}

module.exports  = {lookupCourse};