<template>
    <modal name="login" :height="'auto'" :adaptive = true>
        <form class="form-horizontal" v-if="authForm === 'login'">
            <span class="heading">АВТОРИЗАЦИЯ</span>
            <div class="form-group">
                <input type="email" class="form-control" placeholder="E-mail" v-model="email">
                <i class="fa fa-user"></i>
            </div>
            <div class="form-group help">
                <input type="password" class="form-control" placeholder="Пароль" v-model="password">
                <a v-on:click="authForm ='reset'" id="btn-input-register">Не помню пароль</a>
                <i class="fa fa-lock"></i>
                <a href="#" class="fa fa-question-circle"></a>
            </div>
            <div class="form-group">
                <div class="row" style="padding-top: 1rem">
                    <div class="col">
                        <span class="btn btn-primary float-left" v-on:click="login()" v-if="btnActive">ВХОД</span>
                        <span class="btn btn-primary float-left" v-else>...</span>
                        <span class="btn btn-primary float-right" v-on:click="authForm = 'register'">Регистрация</span>
                    </div>
                </div>
            </div>
            <p v-text="mes" style="color: #ffffff"></p>
        </form>

        <form class="form-horizontal" v-if="authForm === 'register'">
            <span class="heading">РЕГИСТРАЦИЯ</span>

            <div class="form-group">
                <input type="text" class="form-control" placeholder="Логин" v-model="nameReg">
                <i class="fa fa-user"></i>
            </div>

            <div class="form-group">
                <input type="email" class="form-control" placeholder="E-mail" v-model="emailReg">
                <i class="fa fa-user"></i>
            </div>
            <div class="form-group help">
                <input type="password" class="form-control" placeholder="Пароль" v-model="passwordReg">
                <i class="fa fa-lock"></i>
                <a href="#" class="fa fa-question-circle"></a>
            </div>

            <div class="form-group help">
                <input type="password" class="form-control" placeholder="Повторите пароль" v-model="passwordConfReg">
                <i class="fa fa-lock"></i>
                <a href="#" class="fa fa-question-circle"></a>
            </div>

            <div class="form-group">
                <div class="row">
                    <div class="col">
                        <span class="btn btn-primary float-left" v-if="btnActive" v-on:click="register()">Зарегистрироваться</span>
                        <span class="btn btn-primary float-left" v-else>...</span>
                        <span class="btn btn-primary float-right" v-on:click="authForm = 'login' ">Авторизация</span>
                    </div>
                </div>
            </div>
            <p v-text="mes" style="color: #ffffff"></p>
        </form>

        <form class="form-horizontal" v-if="authForm === 'reset'">
            <span class="heading">ВОССТАНОВЛЕНИЕ ПАРОЛЯ</span>

            <div class="form-group help">
                <input type="email" class="form-control" placeholder="Введите свой email" v-model="email">
                <i class="fa fa-lock"></i>
                <a href="#" class="fa fa-question-circle"></a>
            </div>

            <div class="form-group">
                <div class="row">
                    <div class="col">
                        <span class="btn btn-primary float-left" v-if="btnActive" v-on:click="resetPassword()">Восстановить пароль</span>
                        <span class="btn btn-primary float-left" v-else>...</span>
                        <span class="btn btn-primary float-right" v-on:click="authForm = 'login' ">Авторизация</span>
                    </div>
                </div>
            </div>
            <p v-text="mes" style="color: #ffffff"></p>
        </form>

    </modal>
</template>

<script>
export default {
    name: "ModalVue",

    data: ()=>({
        email: undefined,
        password: undefined,
        mes: "",
        authForm: "login",
        admin: false,

        nameReg: undefined,
        passwordReg: undefined,
        passwordConfReg: undefined,
        emailReg: undefined,
        btnActive: true
    }),

    methods: {

        resetPassword(){
            if (!this.email)
            {
                this.mes = "Поле с email-ом не может быть пустым";
                return;
            }

            if(!this.validEmail(this.email)){
                this.mes = "Вы допустили ошибку при вводе Email-а";
                return;
            }
            let data = new FormData();
            data.append('email', this.email);

            api.call('post', '/api/forgot-password?email=den4ic2001@gmail.com', data)
                .then(()=>{
                    this.mes = 'Ссылка на восстановление пароля была отправлена на вашу почту'
                })
                .catch(res=>{
                    if(res.status === 422){
                        this.mes = 'Пользователя с таким email-ом не существует'
                    }
                    else{
                        this.mes = 'Произошла непредвиденная ошибка на сервере'
                    }
                })
        },

        // Метод отвечающий за регистрацию
        register(){
            if(!this.nameReg){
                this.mes = "Поле с логином не может быть пустым";
                return;
            }

            if (!this.emailReg)
            {
                this.mes = "Поле с email-ом не может быть пустым";
                return;
            }

            if(!this.validEmail(this.emailReg)){
                this.mes = "Вы допустили ошибку при вводе Email-а";
                return;
            }

            if(!this.passwordReg){
                this.mes = "Поле с паролем не может быть пустым";
                return;
            }

            if(this.passwordReg.length < 8){
                this.mes = "Минимальная длинна пароля 8 символов"
                return
            }

            if(!this.passwordConfReg){
                this.mes = "Поле с повтором пароля не может быть пустым";
                return;
            }
            if(this.passwordReg !== this.passwordConfReg){
                this.mes = "Пароли не совпадают";
                return;
            }

            this.btnActive = false;
            axios.post('/api/register',{
                email: this.emailReg,
                password: this.passwordReg,
                username: this.nameReg
            })
            .then(res=>{
                this.passwordReg = null;
                this.emailReg = null;
                this.nameReg = null;
                this.passwordConfReg = null;
                this.btnActive = true;

                auth.login(res.data.token, res.data.user);
                Vue.notify({group: 'auth',title: 'Регистрация',text: `${res.data.user.name}, подтвердите свою почту`})
                this.$modal.hide('login')

            })
            .catch(({response}) => {
                if (response.status === 422) {
                    this.mes = "Пользователь с таким email-ом или логином уже зарегистрирован";
                    this.btnActive = true;
                }
            });
        },

        // Метод отвечающий за авторизацию
        login(){
            if (!this.email)
            {
                this.mes = "Поле с email-ом не может быть пустым"
                return;
            }
            if(!this.password){
                this.mes = "Поле с паролем не может быть пустым"
                return;
            }


            this.btnActive = false;

            axios.post('/api/login',{
                username: this.email,
                password: this.password
            }).then(res=>{
                auth.login(res.data.token, res.data.user);
                Vue.notify({group: 'auth',title: 'Авторизация',text: `Добро пожаловать, ${res.data.user.name}`})
                this.$modal.hide('login')

                this.btnActive = true;
                this.email = null;
                this.password = null;
            })
            .catch(data =>{
                this.mes = "Введен неверный логин или пароль"
                this.btnActive = true;
            })
        },
        validEmail(email) {
            let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return re.test(email);
        }
    }
}
</script>

<style scoped>

</style>
