    <template>
      <div class="container">
          <h3>Users</h3>
      <table class="table">
          <thead>
              <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Price</th>
              </tr>
          </thead>
          <tbody>
              <tr v-for="stock in stocks" v-bind:key="stock['Global Quote']['01. symbol']">
              <th scope="row">{{stock['Global Quote']['01. symbol']}}</th>
              <td>{{stock['Global Quote']['05. price']}}</td>
              </tr>
          </tbody>
      </table>
      </div>
  </template>

<script>
import axios from 'axios'
import APIkeysJson from '../../secrets/APIkeys.json'
import StockList from '../assets/data/StockList.json'

export default{
    name:'StocksComponent',
    data(){
        return{
            userStocks:[],
            stocks:[],
            stockSource: null
        };
    },
    methods:{
        getUserStocks(){
            StockList.forEach(element => {
                this.userStocks.push(element.symbol)
            });
        },
        retrieveStocksDataFromAPI(){
        this.getUserStocks();
        for (let i = 0; i < APIkeysJson.length; i++) {
            if(APIkeysJson[i].source === 'Alpha Vantage'){
                this.stockSource = APIkeysJson[i].key
            }
        }

         this.userStocks.forEach(selectedStock => 
        axios
        .get(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=`+selectedStock+`&apikey={$this.stockSource}`)
        .then(res=>{
            this.stocks.push(res.data);
        }));  
        }
    },
    created(){
        this.retrieveStocksDataFromAPI();
    }
}
</script>

<style>
h3{
    margin-bottom:5%
}
</style>