<template>
            <div>
                <div class="sidebar-wrap">
                    <div class="sidebar-box p-4 about text-center ftco-animate" v-if="userId">
                        <img :src="'/storage/images/avatars/' + avatar" class="img-fluid">
                            <avatar-cropper
                                trigger="#uploadAvatar"
                                :upload-url="'/api/user/upload-avatar/' + userId"
                                upload-form-name="avatar"
                                :labels = labels
                                :uploadHeaders = uploadHeaders
                                :output-options = outputOptions
                                :cropper-options = cropperOptions
                                @uploading="handleUploading"
                                @uploaded="handleUploaded"
                                @completed="handleCompleted"
                                @error="handlerError"
                            ></avatar-cropper>
                        <p class=" mb-2">{{name}}</p>
                        <p class="m-2" v-if="admin" style="color: red">Администратор</p>
                        <p class="m-2" v-if="banned" style="color: red">Заблокирован</p>
                        <div class="pt-4">
                            <p v-if="description" class="text-break">{{description}}</p>
                        </div>
                    </div>
                    <div class="sidebar-box p-4 about text-center ftco-animate" v-else>
                        <p>Пользователь не найден</p>
                    </div>
                </div>

                <div v-if="authUser  && userId && authUser.user_id === userId" class="container">
                    <ul class="nav nav-tabs" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <a class="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Настройки профиля</a>
                        </li>
                        <li class="nav-item" role="presentation">
                            <a class="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Настройки учетной записи</a>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <div class="form-group">
                                <label for="statusInput">Статус</label>
                                <input type="text" class="form-control" id="statusInput" v-model="description">
                            </div>

                            <div class="form-group">
                                <label for="uploadAvatar">Аватар</label>
                                <p>{{imageUploadMes}}</p>
                                <button class="btn btn-primary btn-block" id="uploadAvatar">Загрузить новый аватар</button>
                            </div>
                            <span class="btn btn-primary btn-block" v-on:click="updateProfile()">Обновить</span>

                        </div>
                        <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <div class="form-group">
                                <label for="emailInput">Email</label>
                                <input type="text" class="form-control" id="emailInput" v-model="email">
                            </div>

                            <div class="form-group">
                                <label for="oldPasswordInput">Старый пароль</label>
                                <input type="password" class="form-control" id="oldPasswordInput" v-model="oldPassword">
                            </div>

                            <div class="form-group">
                                <label for="passwordInput">Новый пароль</label>
                                <input type="password" class="form-control" id="passwordInput" v-model="newPassword">
                            </div>

                            <div class="form-group">
                                <label for="confirmInput">Повторите пароль</label>
                                <input type="password" class="form-control" id="confirmInput" v-model="confirmPassword">
                            </div>

                            <span class="btn btn-primary btn-block" v-on:click="updateAccount()">Обновить</span>
                        </div>
                    </div>
                </div>

            </div>
</template>

<script>

export default {
    name: "user.profile",

    data(){
        return {
            userId: null,
            name: null,
            description: null,
            banned: 0,
            admin: 0,
            createdAt: null,
            updatedAt: null,
            avatar: null,
            email:null,

            oldPassword: null,
            confirmPassword: null,
            newPassword: null,

            authenticated: auth.check(),
            authUser: auth.user,

            labels: {
                submit: "загрузить",
                cancel: "отмена"
            },

            uploadHeaders: {
                Authorization: "Bearer " + auth.token
            },

            outputOptions:{
                // width: 150,
                // height: 150,
            },
            cropperOptions:{
                maxWidth: 150,
                maxHeight: 150,
                aspectRatio: 1,
                autoCropArea: 1,
                viewMode: 1,
                movable: true,
                zoomable: false
            },
            imageUploadMes: ""
        }
    },

    mounted() {
        this.loadUser();
        Event.$on('userLoggedIn', () => {
            this.authenticated = true;
            this.user = auth.user;
            this.authUser = auth.user;
        });

        Event.$on('userLogout', ()=>{
            this.authenticated = false;
            this.authUser = null;
        });
    },
    methods:{
        updateAccount(){
            if(this.oldPassword){
                this.updatePassword();
            }

            let user = new window.apiUser();
            user.email = this.email;
            user.update(this.authUser.user_id);
            Vue.notify({group: 'auth', text: 'Пожалуйста, зайдите в вашу учетную запись ещё раз'});
            auth.logout();
        },

        updatePassword(){
            if(this.newPassword.length < 8){
                Vue.notify({group: 'auth', title: 'Произошла ошибка', text: 'Поле с паролем должно быть длиннее 8 символов'});
                return null;
            }
            if(this.newPassword !== this.confirmPassword){
                Vue.notify({group: 'auth', title: 'Произошла ошибка', text: 'Пароли не совпадают'});
                return null;
            }

            let data = new FormData();
            data.append('oldPassword', this.oldPassword);
            data.append('password', this.newPassword);
            data.append('password_confirmation', this.confirmPassword);
            api.call('post', '/api/user/password', data)
                .then(res=>{
                    Vue.notify({group: 'auth', title: 'Смена пароля', text: 'Пароль успешно обновлен'});
                })
                .catch(res=>{
                    Vue.notify({group: 'auth', title: 'Произошла ошибка', text: 'Введен неверный старый пароль'});
            });

            this.newPassword = "";
            this.oldPassword = "";
            this.confirmPassword = "";
        },

        updateProfile(){
           let user = new window.apiUser();
           user.name = this.name;
           user.description = this.description;
           user.update(this.authUser.user_id);
        },

        loadUser(){
            let user = new window.apiUser();
            user.get(this.$route.params.userId).then(()=>{
                this.userId = user.id;
                this.name = user.name
                this.email = user.email
                this.description = user.description
                this.avatar = user.avatar
                this.banned = user.banned
                this.admin = user.admin
                this.createdAt = user.createdAt
                this.updatedAt = user.updatedAt
            })
        },

        handleUploading(form, xhr) {
            this.imageUploadMes = "Идет загрузка..."
        },
        handleUploaded(response, form, xhr) {
            this.avatar = response.avatar.name;
            this.imageUploadMes = ""
        },
        handleCompleted(response, form, xhr) {

        },
        handlerError(message, type, xhr) {
            this.imageUploadMes = "Произошла ошибка при загрузке изображения"
        }
    }

}
</script>

<style scoped>


</style>
