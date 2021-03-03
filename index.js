export default Arihmetic = (expression) => {

    let exp = [] 
    let cur = [...expression].filter(item=> item != ' ')

    cur.forEach((e,i) => {  
        if (isOperator(e) || exp.length === 0){
            exp.push(e)
        }else{
            if (isOperator(exp[exp.length - 1])) {
                exp[exp.length] = `${e}`
            } else {
                exp[exp.length - 1] = `${exp[exp.length - 1]}${e}`
            }
        }
    })

    return dal2Rpn(exp)

    
    function isOperator(value){
        let operatorString = "+-*/()";
        return operatorString.indexOf(value) > -1
    }
    
    function getPrioraty(value){
        switch(value){
            case '+':
            case '-':
                return 1;
            case '*':
            case '/':
                return 2;
            default:
                return 0;
        }
    }
    
    function prioraty(o1, o2){
        return getPrioraty(o1) <= getPrioraty(o2);
    }
    
    function dal2Rpn(exp) {
        //输入栈
        let inputStack = [];
        //输出栈
        let outputStack = [];
        //输出队列
        let outputQueue = [];

        for (let i = 0, len = exp.length; i < len; i++) {
            let cur = exp[i];
            if (cur != ' ') {
                inputStack.push(cur); //+-*/() 数字，逐个添加到末尾
            }
        }

        //处理字符和数字
        while (inputStack.length > 0) {

            //shift 顶部取得一项后移除，unshift 顶部推入
            cur = inputStack.shift();

            //如果是符号 -->  + - * / ( )
            if (isOperator(cur)) {
                if (cur == '(') {
                    //push 从尾部推入一项
                    outputStack.push(cur);
                } else if (cur == ')') {
                    //pop 从尾部取得一项，之后移出
                    let po = outputStack.pop();
                    while (po != '(' && outputStack.length > 0) {
                        outputQueue.push(po);
                        po = outputStack.pop();
                    }
                    if (po != '(') {
                        throw "错误：没有匹配";
                    }
                } else { //符号时，处理 + - * /
                    while (prioraty(cur, outputStack[outputStack.length - 1])
                            && outputStack.length > 0) {
                        outputQueue.push(outputStack.pop());
                    }
                    outputStack.push(cur);
                }
            } else { //是数字的时候，推入数字
                outputQueue.push(cur);
            }
        }

        if (outputStack.length > 0) {
            if (outputStack[outputStack.length - 1] == ')'
                    || outputStack[outputStack.length - 1] == '(') {
                throw "错误：没有匹配";
            }
            while (outputStack.length > 0) {
                outputQueue.push(outputStack.pop());
            }
        }
        return evalRpn(outputQueue);
    }

    

    function evalRpn(queue) { 
        let outputStack = [];
        while (queue.length > 0) {
            let cur = queue.shift();

            if (!isOperator(cur)) {
                outputStack.push(cur);
            } else {
                //如果输出堆栈长度小于 2
                if (outputStack.length < 2) {
                    throw "无效堆栈长度";
                }
                let second = outputStack.pop();
                let first = outputStack.pop();
                console.log(getResult(first, second, cur));
                outputStack.push(getResult(first, second, cur));
            }
        }

        if (outputStack.length != 1) {
            throw "不正确的运算";
        } else {
            return outputStack[0];
        }
    }
    

    function getResult(first, second, operator){
        console.log('getResult=>',first, second, operator);
        let result = 0;
        switch (operator) {
            case '+':
                return accAdd(first,second);
            case '-':
                return accSubtr(first,second);
            case '*':
                return accMul(first,second);
            case '/':
                return accDivCoupon(first,second);
            default:
                return 0;
        }
    }


    /**
     * 加法
     * @param arg1
     * @param arg2
     * @returns
     */
    
    function accAdd(arg1,arg2){
        let r1,r2,m; 
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
        m=Math.pow(10,Math.max(r1,r2)); 
        return (arg1*m+arg2*m)/m; 
    }
    
    /**
     * 减法
     * @param arg1
     * @param arg2
     * @returns
     */

    function accSubtr  (arg1,arg2){
        let r1,r2,m,n; 
        try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0} 
        try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0} 
        m=Math.pow(10,Math.max(r1,r2)); 
        //动态控制精度长度 
        n=(r1>=r2)?r1:r2; 
        return ((arg1*m-arg2*m)/m).toFixed(n);
    } 
    
    /***
     * 乘法，获取精确乘法的结果值
     * @param arg1
     * @param arg2
     * @returns
     */
    function accMul(arg1,arg2){
        let m=0,s1=arg1.toString(),s2=arg2.toString(); 
        try{m+=s1.split(".")[1].length}catch(e){} 
        try{m+=s2.split(".")[1].length}catch(e){} 
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m); 
    }
    
    /***
     * 除法，获取精确乘法的结果值
     * @param arg1
     * @param arg2
     * @returns
     */
    function accDivCoupon (arg1,arg2){
        let t1=0,t2=0,r1,r2; 
        try{t1=arg1.toString().split(".")[1].length}catch(e){} 
        try{t2=arg2.toString().split(".")[1].length}catch(e){} 
        r1=Number(arg1.toString().replace(".","")); 
        r2=Number(arg2.toString().replace(".","")); 
        return (r1/r2)*Math.pow(10,t2-t1);
    }
    
}