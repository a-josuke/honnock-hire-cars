/**
 *
 * Template : Go-Rental HTML TEMPLATE
 * Author : ThemeWant
 * Author URI : https://themewant.com/
 *
 **/

(function ($) {
    'use strict';

    // Handles every form on the site that submits to Web3Forms, not just
    // the main contact page, so all of them show an inline success/error
    // message instead of navigating to Web3Forms' raw JSON response.
    $(document).on('submit', 'form[action="https://api.web3forms.com/submit"]', function (e) {
        e.preventDefault();

        var form = $(this);
        var formData = form.serialize();

        // Reuse the form's own #form-messages div if it has one (contact.html),
        // otherwise create a feedback element right after the form.
        var formMessages = form.next('#form-messages');
        if (formMessages.length === 0) {
            formMessages = form.siblings('#form-messages');
        }
        if (formMessages.length === 0) {
            formMessages = $('<div class="web3forms-feedback"></div>');
            form.after(formMessages);
        }

        var submitBtn = form.find('button[type="submit"]');
        var originalBtnHtml = submitBtn.html();
        submitBtn.prop('disabled', true).text('Sending...');

        $.ajax({
                type: 'POST',
                url: form.attr('action'),
                data: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .done(function (response) {
                formMessages.removeClass('error').addClass('success web3forms-feedback');

                if (response && response.message) {
                    formMessages.text(response.message);
                } else {
                    formMessages.text('Thanks! Your message has been sent.');
                }

                form[0].reset();
            })
            .fail(function (data) {
                formMessages.removeClass('success').addClass('error web3forms-feedback');

                if (data.responseJSON && data.responseJSON.message) {
                    formMessages.text(data.responseJSON.message);
                } else if (data.responseText) {
                    formMessages.text(data.responseText);
                } else {
                    formMessages.text('Oops! An error occurred and your message could not be sent.');
                }
            })
            .always(function () {
                submitBtn.prop('disabled', false).html(originalBtnHtml);
            });
    });

})(jQuery);
